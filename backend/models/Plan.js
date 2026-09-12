const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID,
      default: () => new mongoose.Types.UUID(),
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      trim: true,
    },
    duration_months: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Plan', planSchema);
