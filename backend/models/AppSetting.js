const mongoose = require('mongoose');

const appSettingSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID,
      default: () => new mongoose.Types.UUID(),
      required: true,
      unique: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      trim: true,
    },
    value: {
      type: String,
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.UUID,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('AppSetting', appSettingSchema);
