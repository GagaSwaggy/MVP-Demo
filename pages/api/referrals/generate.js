import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Campaign from '@/models/Campaign';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { email, campaignId, name } = req.body;

    // Validate campaign exists and is active
    const campaign = await Campaign.findOne({ _id: campaignId, active: true });
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found or inactive' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        name,
      });
    }

    // Generate a referral URL
    const referralUrl = `${process.env.NEXT_PUBLIC_URL}/refer/${user.referralCode}/${campaignId}`;

    return res.status(200).json({
      success: true,
      data: {
        referralUrl,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}