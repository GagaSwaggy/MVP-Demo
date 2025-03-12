import dbConnect from '@/lib/dbConnect';
import Campaign from '@/models/Campaign';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    // Find all active campaigns
    const campaigns = await Campaign.find({ active: true })
      .select('name description rewards') // Only return necessary fields
      .limit(10); // Limit to 10 active campaigns

    return res.status(200).json({ success: true, data: campaigns });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}