import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a campaign name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  task: {
    description: {
      type: String,
      required: [true, 'Please describe the task'],
    },
    validationMethod: {
      type: String,
      enum: ['auto', 'manual'],
      default: 'manual',
    },
  },
  rewards: {
    referrerDiscount: {
      type: Number,
      required: [true, 'Please specify referrer discount amount'],
      min: 0,
    },
    referredDiscount: {
      type: Number,
      required: [true, 'Please specify referred discount amount'],
      min: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);