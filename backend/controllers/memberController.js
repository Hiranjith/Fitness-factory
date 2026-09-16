const mongoose = require('mongoose');
const Member = require('../models/Member');
const Membership = require('../models/Membership');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');
const Reminder = require('../models/Reminder');

const attachCurrentMembership = async (membersList) => {
  if (!membersList.length) return [];
  const memberIds = membersList.map((m) => m.id);

  const activeMemberships = await Membership.find({
    member_id: { $in: memberIds },
    status: 'active',
  }).lean();

  const planIds = activeMemberships.map((m) => m.plan_id);
  const plans = await Plan.find({ id: { $in: planIds } }).lean();

  return membersList.map((member) => {
    const mMemberships = activeMemberships.filter((m) => m.member_id?.toString() === member.id?.toString());
    mMemberships.sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
    const current = mMemberships[0];

    if (current) {
      const plan = plans.find((p) => p.id?.toString() === current.plan_id?.toString());
      member.currentMembership = {
        planId: current.plan_id,
        planName: plan ? plan.name : 'Unknown',
        amount: current.amount,
        startDate: current.start_date,
        endDate: current.end_date,
        status: current.status,
      };
    } else {
      member.currentMembership = null;
    }
    return member;
  });
};

// @desc    Register a new member
// @route   POST /api/members
// @access  Public/Private
exports.registerMember = async (req, res, next) => {
  try {
    const { serial_no, name, address, mobile_number, plan_id, start_date } = req.body;

    // Verify if the plan exists
    const plan = await Plan.findOne({ id: plan_id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Check if serial_no is already taken
    const existingSerial = await Member.findOne({ serial_no });
    if (existingSerial) {
      return res.status(409).json({ success: false, message: 'Serial number already exists' });
    }

    const parsedStartDate = start_date ? new Date(start_date) : new Date();

    // Create the member
    const newMember = new Member({
      serial_no,
      name,
      address,
      mobile_number,
      status: 'active',
      start_date: parsedStartDate,
    });

    await newMember.save();

    // Calculate end date based on plan duration
    const end_date = new Date(parsedStartDate);
    end_date.setMonth(parsedStartDate.getMonth() + plan.duration_months);

    // Create initial membership record
    const membership = new Membership({
      member_id: newMember.id,
      plan_id: plan.id,
      start_date: parsedStartDate,
      end_date,
      amount: plan.price,
      status: 'active',
    });

    await membership.save();

    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: {
        member: {
          ...newMember.toJSON(),
          currentMembership: {
            planId: plan.id,
            planName: plan.name,
            amount: plan.price,
            startDate: parsedStartDate,
            endDate: end_date,
            status: 'active',
          }
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members with pagination, search and filters
// @route   GET /api/members
// @access  Public/Private
exports.listMembers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Base query (exclude soft-deleted)
    let query = { deleted_at: null };

    // Search by name or mobile number
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { mobile_number: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Member.countDocuments(query);
    const members = await Member.find(query).skip(startIndex).limit(limit).sort({ created_at: -1 }).lean();

    const membersWithMembership = await attachCurrentMembership(members);

    res.status(200).json({
      success: true,
      count: members.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: membersWithMembership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members without pagination
// @route   GET /api/members/all
// @access  Public/Private
exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await Member.find({ deleted_at: null }).sort({ created_at: -1 }).lean();
    
    const membersWithMembership = await attachCurrentMembership(members);
    
    res.status(200).json({
      success: true,
      count: membersWithMembership.length,
      data: membersWithMembership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member details along with memberships
// @route   GET /api/members/:id
// @access  Public/Private
exports.getMemberDetails = async (req, res, next) => {
  try {
    const member = await Member.findOne({ id: req.params.id, deleted_at: null }).lean();

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const memberships = await Membership.find({ member_id: member.id }).sort({ start_date: -1 }).lean();

    // Attach currentMembership
    const [memberWithMembership] = await attachCurrentMembership([member]);

    const latestPayment = await Payment.findOne({ member_id: member.id }).sort({ payment_date: -1 }).lean();

    res.status(200).json({
      success: true,
      data: {
        member: memberWithMembership,
        memberships,
        latestPayment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a member
// @route   PUT /api/members/:id
// @access  Public/Private
exports.editMember = async (req, res, next) => {
  try {
    const { name, address, mobile_number, status, plan_id, start_date } = req.body;

    const member = await Member.findOne({ id: req.params.id, deleted_at: null });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Update only allowed fields
    if (name !== undefined) member.name = name;
    if (address !== undefined) member.address = address;
    if (mobile_number !== undefined) member.mobile_number = mobile_number;
    if (status !== undefined) member.status = status;

    await member.save();

    // Check if membership details are being updated
    if (plan_id || start_date) {
      const activeMembership = await Membership.findOne({ member_id: member.id, status: 'active' }).sort({ end_date: -1 });
      
      if (activeMembership) {
        let planToUseId = plan_id || activeMembership.plan_id;
        const plan = await Plan.findOne({ id: planToUseId });
        
        if (plan) {
           const parsedStartDate = start_date ? new Date(start_date) : new Date(activeMembership.start_date);
           const end_date = new Date(parsedStartDate);
           end_date.setMonth(parsedStartDate.getMonth() + plan.duration_months);

           activeMembership.plan_id = plan.id;
           activeMembership.start_date = parsedStartDate;
           activeMembership.end_date = end_date;
           activeMembership.amount = plan.price;
           await activeMembership.save();
        }
      }
    }

    const [memberWithMembership] = await attachCurrentMembership([member.toObject()]);

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: memberWithMembership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete a member and all associated data
// @route   DELETE /api/members/:id
// @access  Public/Private
exports.archiveMember = async (req, res, next) => {
  try {
    const member = await Member.findOne({ id: req.params.id });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Permanently delete associated data to prevent orphan records
    await Membership.deleteMany({ member_id: member.id });
    await Payment.deleteMany({ member_id: member.id });
    await Reminder.deleteMany({ member_id: member.id });

    // Delete the member record itself
    await Member.deleteOne({ id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Member and all associated data permanently deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a payment for a member and extend membership
// @route   POST /api/members/:id/payments
// @access  Public/Private
exports.recordPayment = async (req, res, next) => {
  try {
    const { amount, payment_method, payment_date } = req.body;
    const memberId = req.params.id;

    const member = await Member.findOne({ id: memberId, deleted_at: null });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const activeMembership = await Membership.findOne({ member_id: memberId, status: 'active' }).sort({ end_date: -1 });
    if (!activeMembership) {
      return res.status(400).json({ success: false, message: 'No active membership found for this member' });
    }

    const plan = await Plan.findOne({ id: activeMembership.plan_id });
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Plan associated with membership not found' });
    }

    const payDate = payment_date ? new Date(payment_date) : new Date();

    // Create a Payment record
    const payment = new Payment({
      member_id: memberId,
      membership_id: activeMembership.id,
      amount,
      payment_date: payDate,
      payment_method,
      status: 'Paid',
    });

    await payment.save();

    // Extend the membership based strictly on the old end date
    const oldEndDate = new Date(activeMembership.end_date);
    const newEndDate = new Date(oldEndDate);
    newEndDate.setMonth(oldEndDate.getMonth() + plan.duration_months);

    activeMembership.start_date = oldEndDate;
    activeMembership.end_date = newEndDate;
    await activeMembership.save();

    // Re-fetch member details
    const [memberWithMembership] = await attachCurrentMembership([member.toObject()]);

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        payment,
        member: memberWithMembership,
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments for a member
// @route   GET /api/members/:id/payments
// @access  Public/Private
exports.getMemberPayments = async (req, res, next) => {
  try {
    const memberId = req.params.id;

    const member = await Member.findOne({ id: memberId, deleted_at: null });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const [memberWithMembership] = await attachCurrentMembership([member.toObject()]);

    const payments = await Payment.find({ member_id: memberId }).sort({ payment_date: -1 }).lean();

    res.status(200).json({
      success: true,
      data: {
        member: memberWithMembership,
        payments,
      }
    });

  } catch (error) {
    next(error);
  }
};
