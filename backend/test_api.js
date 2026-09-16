const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-factory').then(async () => {
  const Payment = require('./models/Payment');
  const Member = require('./models/Member');
  const Plan = require('./models/Plan');
  const Membership = require('./models/Membership');

  const payments = await Payment.find().sort({ payment_date: -1 }).limit(5).lean();
  const memberIds = payments.map(p => p.member_id);
  const members = await Member.find({ id: { $in: memberIds }, deleted_at: null }).lean();
  
  const membershipIds = payments.map(p => p.membership_id);
  const memberships = await Membership.find({ id: { $in: membershipIds } }).lean();
  
  const planIds = memberships.map(m => m.plan_id);
  const plans = await Plan.find({ id: { $in: planIds } }).lean();

  const formattedPayments = payments.map(payment => {
    const member = members.find(m => m.id.toString() === payment.member_id.toString());
    const membership = memberships.find(m => m.id.toString() === payment.membership_id.toString());
    const plan = membership ? plans.find(p => p.id.toString() === membership.plan_id.toString()) : null;

    if (!member) return null;

    return {
      _id: payment._id,
      amount: payment.amount,
      member: {
        id: member.id,
        name: member.name,
      },
      plan: {
        name: plan ? plan.name : 'Unknown Plan',
      }
    };
  }).filter(Boolean);

  console.log('Result:', JSON.stringify(formattedPayments, null, 2));
  process.exit(0);
});
