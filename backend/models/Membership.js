const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID,
      default: () => new mongoose.Types.UUID(),
      required: true,
      unique: true,
      index: true,
    },
    member_id: {
      type: mongoose.Schema.Types.UUID,
      ref: 'Member',
      required: true,
      index: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.UUID,
      ref: 'Plan',
      required: true,
      index: true,
    },
    start_date: {
      type: Date,
      required: true,
      index: true,
    },
    end_date: {
      type: Date,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      maxlength: 20,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Compound Indexes
membershipSchema.index({ member_id: 1, status: 1 });
membershipSchema.index({ status: 1, end_date: 1 });

module.exports = mongoose.model('Membership', membershipSchema);
