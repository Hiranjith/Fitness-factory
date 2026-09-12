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
    const plans = await Plan.find(query).skip(startIndex).limit(limit).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: plans,
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
    if (price !== undefined) plan.price = price;
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

// @desc    Archive (deactivate) a plan
// @route   DELETE /api/plans/:id
// @access  Public/Private
exports.archivePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findOne({ id: req.params.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    plan.is_active = false;
    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Plan archived (deactivated) successfully',
    });
  } catch (error) {
    next(error);
  }
};
