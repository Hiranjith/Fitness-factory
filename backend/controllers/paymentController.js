const Payment = require('../models/Payment');
const Member = require('../models/Member');
const Plan = require('../models/Plan');

// @desc    Get recent payments
// @route   GET /api/payments/recent
// @access  Public/Private
exports.getRecentPayments = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    // Fetch the most recent payments, showing only the latest payment per member
    const payments = await Payment.aggregate([
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: "$member_id",
          payment: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$payment" } },
      { $sort: { created_at: -1 } },
      { $limit: limit }
    ]);

    if (!payments.length) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Attach member and plan details
    const memberIds = payments.map(p => p.member_id);
    const members = await Member.find({ id: { $in: memberIds }, deleted_at: null }).lean();
    
    // We need to fetch the membership associated with each payment to get the plan details
    // But since payment model doesn't store planName directly (it has membership_id), 
    // we can get the plan by looking up the membership -> plan
    const Membership = require('../models/Membership');
    const membershipIds = payments.map(p => p.membership_id);
    const memberships = await Membership.find({ id: { $in: membershipIds } }).lean();
    
    const planIds = memberships.map(m => m.plan_id);
    const plans = await Plan.find({ id: { $in: planIds } }).lean();

    const formattedPayments = payments.map(payment => {
      const member = members.find(m => m.id.toString() === payment.member_id.toString());
      const membership = memberships.find(m => m.id.toString() === payment.membership_id.toString());
      const plan = membership ? plans.find(p => p.id.toString() === membership.plan_id.toString()) : null;

      if (!member) return null; // Exclude payments of deleted members

      return {
        _id: payment._id,
        amount: payment.amount,
        payment_date: payment.created_at || payment.payment_date,
        payment_method: payment.payment_method,
        status: payment.status,
        member: {
          id: member.id,
          name: member.name,
        },
        plan: {
          name: plan ? plan.name : 'Unknown Plan',
        }
      };
    }).filter(Boolean); // Remove nulls

    res.status(200).json({
      success: true,
      data: formattedPayments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments with search, filters, pagination
// @route   GET /api/payments
// @access  Public/Private
exports.getAllPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const filter = req.query.filter || 'All';

    let memberIds = null;

    if (search) {
      const members = await Member.find({ 
        $or: [
          { name: { $regex: search, $options: 'i' } },
        ],
        deleted_at: null 
      }).select('id').lean();
      memberIds = members.map(m => m.id);
    }

    const queryMatch = {};
    if (memberIds !== null) {
      queryMatch.member_id = { $in: memberIds };
    }

    // Determine date boundaries
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    
    // For This Week, assuming week starts on Monday
    const startOfWeek = new Date(startOfToday);
    const dayOfWeek = startOfWeek.getDay() || 7; 
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    let activeQuery = { ...queryMatch };
    if (filter === 'Today') {
      activeQuery.created_at = { $gte: startOfToday, $lt: endOfToday };
    } else if (filter === 'This Week') {
      activeQuery.created_at = { $gte: startOfWeek, $lt: endOfWeek };
    } else if (filter === 'This Month') {
      activeQuery.created_at = { $gte: startOfMonth, $lt: endOfMonth };
    }

    const payments = await Payment.find(activeQuery)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Payment.countDocuments(activeQuery);

    const counts = {
      All: await Payment.countDocuments(queryMatch),
      Today: await Payment.countDocuments({ ...queryMatch, created_at: { $gte: startOfToday, $lt: endOfToday } }),
      'This Week': await Payment.countDocuments({ ...queryMatch, created_at: { $gte: startOfWeek, $lt: endOfWeek } }),
      'This Month': await Payment.countDocuments({ ...queryMatch, created_at: { $gte: startOfMonth, $lt: endOfMonth } }),
    };

    if (!payments.length) {
      return res.status(200).json({
        success: true,
        data: [],
        counts,
        pagination: { total: 0, page, limit, totalPages: 0 }
      });
    }

    const resultMemberIds = payments.map(p => p.member_id);
    const membersList = await Member.find({ id: { $in: resultMemberIds }, deleted_at: null }).lean();
    
    const Membership = require('../models/Membership');
    const membershipIds = payments.map(p => p.membership_id);
    const memberships = await Membership.find({ id: { $in: membershipIds } }).lean();
    
    const planIds = memberships.map(m => m.plan_id);
    const plans = await Plan.find({ id: { $in: planIds } }).lean();

    const formattedPayments = payments.map(payment => {
      const member = membersList.find(m => m.id.toString() === payment.member_id.toString());
      const membership = memberships.find(m => m.id.toString() === payment.membership_id.toString());
      const plan = membership ? plans.find(p => p.id.toString() === membership.plan_id.toString()) : null;

      if (!member) return null;

      return {
        _id: payment._id,
        amount: payment.amount,
        payment_date: payment.created_at || payment.payment_date,
        payment_method: payment.payment_method,
        status: payment.status,
        member: {
          id: member.id,
          name: member.name,
        },
        plan: {
          name: plan ? plan.name : 'Unknown Plan',
        }
      };
    }).filter(Boolean);

    res.status(200).json({
      success: true,
      data: formattedPayments,
      counts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming payments (memberships expiring soon)
// @route   GET /api/payments/upcoming
// @access  Public/Private
exports.getUpcomingPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const filter = req.query.filter || 'All'; // All, Tomorrow, Next 7 Days, Overdue

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const Member = require('../models/Member');
    const Membership = require('../models/Membership');
    const Plan = require('../models/Plan');

    // If search exists, find member IDs first
    let memberMatch = { deleted_at: null };
    if (search) {
      memberMatch.name = { $regex: search, $options: 'i' };
    }
    const matchedMembers = await Member.find(memberMatch).lean();
    const matchedMemberIds = matchedMembers.map(m => m.id);

    // Fetch all relevant active/overdue memberships matching these members
    const allRelevantMemberships = await Membership.find({
      status: { $in: [/^active$/i, /^overdue$/i] },
      member_id: { $in: matchedMemberIds }
    }).lean();

    // Map plans
    const planIds = [...new Set(allRelevantMemberships.map(m => m.plan_id))];
    const plans = await Plan.find({ id: { $in: planIds } }).lean();

    // Calculate dates and diffs for all
    let processed = allRelevantMemberships.map(membership => {
      const member = matchedMembers.find(m => m.id.toString() === membership.member_id.toString());
      const plan = plans.find(p => p.id.toString() === membership.plan_id.toString());
      if (!member) return null;

      const endDate = new Date(membership.end_date);
      const endOfThatDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const diffTime = endOfThatDay - startOfToday;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      let dueDateStr = '';
      let statusStr = 'Active';

      if (diffDays === 1) {
        dueDateStr = 'Tomorrow';
        statusStr = 'Due Soon';
      } else if (diffDays === 0) {
        dueDateStr = 'Today';
        statusStr = 'Due Soon';
      } else if (diffDays < 0) {
        dueDateStr = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        statusStr = 'Overdue';
      } else {
        dueDateStr = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (diffDays <= 7) {
          statusStr = 'Due Soon';
        }
      }

      if (membership.status.toLowerCase() === 'overdue') {
        statusStr = 'Overdue';
      }

      return {
        _id: membership._id,
        id: member.id,
        name: member.name,
        plan: plan ? plan.name : 'Unknown Plan',
        amount: membership.amount,
        dueDate: dueDateStr,
        status: statusStr,
        diffDays: diffDays,
        endDate: endDate
      };
    }).filter(Boolean);

    // Sort by diffDays ascending so most overdue or soonest comes first
    processed.sort((a, b) => a.diffDays - b.diffDays);

    // Calculate counts for all tabs BEFORE filtering
    const counts = {
      All: processed.length,
      Tomorrow: processed.filter(p => p.diffDays === 1).length,
      'Next 7 Days': processed.filter(p => p.diffDays >= 0 && p.diffDays <= 7).length,
      Overdue: processed.filter(p => p.status === 'Overdue' || p.diffDays < 0).length,
    };

    // Apply active filter
    let filtered = processed;
    if (filter === 'Tomorrow') {
      filtered = processed.filter(p => p.diffDays === 1);
    } else if (filter === 'Next 7 Days') {
      filtered = processed.filter(p => p.diffDays >= 0 && p.diffDays <= 7);
    } else if (filter === 'Overdue') {
      filtered = processed.filter(p => p.status === 'Overdue' || p.diffDays < 0);
    }

    // Paginate
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResult = filtered.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedResult,
      counts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
