import dbConnect from '@/lib/dbConnect';
import Campaign from '@/models/Campaign';
import { authMiddleware } from '@/lib/authMiddleware';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  // Add middleware to authenticate
  await new Promise((resolve, reject) => {
    authMiddleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  }).catch(() => {
    return;
  });

  // If not authenticated, middleware would have returned a response
  if (res.writableEnded) return;

  // Get a single campaign
  if (req.method === 'GET') {
    try {
      const campaign = await Campaign.findOne({
        _id: id,
        businessId: req.business._id,
      });

      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      return res.status(200).json({ success: true, data: campaign });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Update a campaign
  if (req.method === 'PUT') {
    try {
      const campaign = await Campaign.findOneAndUpdate(
        { _id: id, businessId: req.business._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      return res.status(200).json({ success: true, data: campaign });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete a campaign
  if (req.method === 'DELETE') {
    try {
      const campaign = await Campaign.findOneAndDelete({
        _id: id,
        businessId: req.business._id,
      });

      if (!campaign) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
      }

      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}