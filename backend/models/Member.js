const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID,
      default: () => new mongoose.Types.UUID(),
      required: true,
      unique: true,
      index: true,
    },
    serial_no: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 150,
      trim: true,
    },
    address: {
      type: String,
      default: null,
    },
    mobile_number: {
      type: String,
      required: true,
      maxlength: 20,
    },
    status: {
      type: String,
      required: true,
      maxlength: 20,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Member', memberSchema);
