import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Campaign from '@/models/Campaign';
import Referral from '@/models/Referral';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { referralCode, campaignId, email, name } = req.body;

    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ success: false, message: 'Invalid referral code' });
    }

    // Validate campaign exists and is active
    const campaign = await Campaign.findOne({ _id: campaignId, active: true });
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found or inactive' });
    }

    // Create or find the referred user
    let referredUser = await User.findOne({ email });
    
    if (!referredUser) {
      referredUser = await User.create({
        email,
        name,
        referredBy: referrer._id
      });
    } else if (referredUser._id.equals(referrer._id)) {
      return res.status(400).json({ success: false, message: 'Cannot refer yourself' });
    }

    // Check if this task was already completed
    const alreadyCompleted = referredUser.completedTasks.some(
      task => task.campaignId.equals(campaign._id)
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ success: false, message: 'Task already completed' });
    }

    // Create or update referral record
    let referral = await Referral.findOne({
      campaignId: campaign._id,
      referrerId: referrer._id,
      referredId: referredUser._id
    });

    if (!referral) {
      referral = await Referral.create({
        campaignId: campaign._id,
        referrerId: referrer._id,
        referredId: referredUser._id,
        status: 'completed',
        completedAt: new Date()
      });
    } else {
      referral.status = 'completed';
      referral.completedAt = new Date();
      await referral.save();
    }

    // Mark task as completed for referred user
    referredUser.completedTasks.push({
      campaignId: campaign._id,
      completedAt: new Date()
    });

    // Generate reward for referred user
    const referredDiscountCode = crypto.randomBytes(6).toString('hex');
    referredUser.rewards.push({
      campaignId: campaign._id,
      discountCode: referredDiscountCode,
      amount: campaign.rewards.referredDiscount,
      discountType: campaign.rewards.discountType
    });
    
    await referredUser.save();

    // Generate reward for referrer
    const referrerDiscountCode = crypto.randomBytes(6).toString('hex');
    referrer.rewards.push({
      campaignId: campaign._id,
      discountCode: referrerDiscountCode,
      amount: campaign.rewards.referrerDiscount,
      discountType: campaign.rewards.discountType
    });
    
    await referrer.save();

    // Update referral status to rewarded
    referral.status = 'rewarded';
    await referral.save();

    return res.status(200).json({
      success: true,
      data: {
        message: 'Referral completed successfully',
        discountCode: referredDiscountCode,
        discountAmount: campaign.rewards.referredDiscount,
        discountType: campaign.rewards.discountType
      }
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}