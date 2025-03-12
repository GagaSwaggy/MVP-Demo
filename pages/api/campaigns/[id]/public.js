import dbConnect from '@/lib/dbConnect';
import Campaign from '@/models/Campaign';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  await dbConnect();

  try {
    // Find active campaign by ID
    const campaign = await Campaign.findOne({
      _id: id,
      active: true,
    }).select('-businessId'); // Don't expose business ID

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found or inactive' });
    }

    return res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}