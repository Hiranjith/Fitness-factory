const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
    membership_id: {
      type: mongoose.Schema.Types.UUID,
      ref: 'Membership',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_date: {
      type: Date,
      required: true,
      index: true,
    },
    payment_method: {
      type: String,
      required: true,
      maxlength: 20,
      index: true,
    },
    status: {
      type: String,
      required: true,
      maxlength: 20,
      index: true,
    },
    verified_at: {
      type: Date,
      default: null,
    },
    verified_by: {
      type: mongoose.Schema.Types.UUID,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Compound Index
paymentSchema.index({ status: 1, payment_date: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
