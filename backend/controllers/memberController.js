const mongoose = require('mongoose');
const Member = require('../models/Member');
const Membership = require('../models/Membership');
const Plan = require('../models/Plan');

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
    const mMemberships = activeMemberships.filter((m) => m.member_id === member.id);
    mMemberships.sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
    const current = mMemberships[0];

    if (current) {
      const plan = plans.find((p) => p.id === current.plan_id);
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
    const { serial_no, name, address, mobile_number, plan_id } = req.body;

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

    // Create the member
    const newMember = new Member({
      serial_no,
      name,
      address,
      mobile_number,
      status: 'active',
    });

    await newMember.save();

    // Calculate end date based on plan duration
    const start_date = new Date();
    const end_date = new Date();
    end_date.setMonth(start_date.getMonth() + plan.duration_months);

    // Create initial membership record
    const membership = new Membership({
      member_id: newMember.id,
      plan_id: plan.id,
      start_date,
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
            startDate: start_date,
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

    res.status(200).json({
      success: true,
      data: {
        member: memberWithMembership,
        memberships,
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
    const { name, address, mobile_number, status } = req.body;

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

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive (soft delete) a member
// @route   DELETE /api/members/:id
// @access  Public/Private
exports.archiveMember = async (req, res, next) => {
  try {
    const member = await Member.findOne({ id: req.params.id, deleted_at: null });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    member.deleted_at = new Date();
    await member.save();

    // Optionally mark memberships as inactive/archived
    await Membership.updateMany(
      { member_id: member.id },
      { $set: { status: 'archived' } }
    );

    res.status(200).json({
      success: true,
      message: 'Member archived successfully',
    });
  } catch (error) {
    next(error);
  }
};
