const Plan = require('../models/Plan');

// @desc    Create a new plan
// @route   POST /api/plans
// @access  Public/Private
exports.createPlan = async (req, res, next) => {
  try {
    const { name, duration_months, price } = req.body;

    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(409).json({ success: false, message: 'Plan with this name already exists' });
    }

    const newPlan = new Plan({
      name,
      duration_months,
      price,
      is_active: true,
    });

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: newPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all plans with pagination and search
// @route   GET /api/plans
// @access  Public/Private
exports.listPlans = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.is_active !== undefined) {
      query.is_active = req.query.is_active === 'true';
    }

    const total = await Plan.countDocuments(query);
    const plans = await Plan.find(query).skip(startIndex).limit(limit).sort({ price: 1 }).lean();

    const Membership = require('../models/Membership');
    const planIds = plans.map(p => p.id);
    const activeMemberships = await Membership.find({ plan_id: { $in: planIds }, status: 'active' }).lean();

    const plansWithCounts = plans.map(plan => {
      const count = activeMemberships.filter(m => m.plan_id === plan.id).length;
      return { ...plan, active_members_count: count };
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: plansWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active plans without pagination
// @route   GET /api/plans/all
// @access  Public/Private
exports.getAllActivePlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ is_active: true }).sort({ created_at: -1 });
    
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get plan details
// @route   GET /api/plans/:id
// @access  Public/Private
exports.getPlanDetails = async (req, res, next) => {
  try {
    const plan = await Plan.findOne({ id: req.params.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a plan
// @route   PUT /api/plans/:id
// @access  Public/Private
exports.editPlan = async (req, res, next) => {
  try {
    const { name, duration_months, price, is_active } = req.body;

    const plan = await Plan.findOne({ id: req.params.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    if (name !== undefined) {
      // Check for name collision if name is changed
      if (name !== plan.name) {
        const existingPlan = await Plan.findOne({ name });
        if (existingPlan) {
          return res.status(409).json({ success: false, message: 'Plan with this name already exists' });
        }
      }
      plan.name = name;
    }

    if (duration_months !== undefined) plan.duration_months = duration_months;
    
    if (price !== undefined) {
      const priceChanged = plan.price !== price;
      plan.price = price;
      
      if (priceChanged) {
        const Membership = require('../models/Membership');
        await Membership.updateMany(
          { plan_id: plan.id, status: 'active' },
          { $set: { amount: price } }
        );
      }
    }
    
    if (is_active !== undefined) plan.is_active = is_active;

    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a plan permanently
// @route   DELETE /api/plans/:id
// @access  Public/Private
exports.archivePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findOneAndDelete({ id: req.params.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Plan deleted permanently',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get members subscribed to a plan
// @route   GET /api/plans/:id/members
// @access  Public/Private
exports.getPlanMembers = async (req, res, next) => {
  try {
    const Membership = require('../models/Membership');
    const Member = require('../models/Member');

    const plan = await Plan.findOne({ id: req.params.id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const activeMemberships = await Membership.find({ plan_id: plan.id, status: 'active' }).lean();
    const memberIds = activeMemberships.map(m => m.member_id);

    const members = await Member.find({ id: { $in: memberIds }, deleted_at: null }).lean();

    const formattedMembers = members.map(m => {
      const membership = activeMemberships.find(mem => mem.member_id?.toString() === m.id?.toString());
      return {
        id: m.id,
        serial_no: m.serial_no,
        name: m.name,
        phone: m.mobile_number,
        joinDate: membership?.start_date,
        nextDueDate: membership?.end_date,
        status: 'Active'
      };
    });

    res.status(200).json({
      success: true,
      count: formattedMembers.length,
      data: formattedMembers,
    });
  } catch (error) {
    next(error);
  }
};
