const Member = require('../models/Member');
const Membership = require('../models/Membership');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalMembers = await Member.countDocuments({ deleted_at: null });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const activeMemberships = await Membership.find({
      status: { $in: [/^active$/i, /^overdue$/i] }
    }).lean();

    let activeCount = 0;
    let dueTomorrowCount = 0;
    let overdueCount = 0;

    activeMemberships.forEach(membership => {
      const endDate = new Date(membership.end_date);
      const endOfThatDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const diffTime = endOfThatDay - startOfToday;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (membership.status.toLowerCase() === 'active') {
        activeCount++;
      }
      
      if (diffDays === 1) {
        dueTomorrowCount++;
      }

      if (membership.status.toLowerCase() === 'overdue' || diffDays < 0) {
        overdueCount++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers: activeCount,
        dueTomorrow: dueTomorrowCount,
        overdue: overdueCount
      }
    });
  } catch (error) {
    next(error);
  }
};
