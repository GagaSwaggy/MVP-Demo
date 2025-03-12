import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  completedTasks: [{
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  rewards: [{
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    discountCode: String,
    amount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
    },
    used: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


UserSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = crypto.randomBytes(4).toString('hex');
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);