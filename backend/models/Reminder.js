const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
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
    scheduled_for: {
      type: Date,
      required: true,
      index: true,
    },
    sent_at: {
      type: Date,
      default: null,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['scheduled', 'sending', 'sent', 'failed', 'cancelled'],
      maxlength: 20,
      index: true,
    },
    failure_reason: {
      type: String,
      default: null,
    },
    provider_message_id: {
      type: String,
      maxlength: 255,
      default: null,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

// Compound Index
reminderSchema.index({ status: 1, scheduled_for: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
