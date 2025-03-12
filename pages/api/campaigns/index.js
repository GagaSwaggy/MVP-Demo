import dbConnect from '@/lib/dbConnect';
import Campaign from '@/models/Campaign';
import { authMiddleware } from '@/lib/authMiddleware';

export default async function handler(req, res) {
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

  // Handle GET request - Get all campaigns for a business
  if (req.method === 'GET') {
    try {
      const campaigns = await Campaign.find({ businessId: req.business._id });
      return res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Handle POST request - Create a new campaign
  if (req.method === 'POST') {
    try {
      const { name, description, task, rewards } = req.body;
      
      const campaign = await Campaign.create({
        businessId: req.business._id,
        name,
        description,
        task,
        rewards,
      });

      return res.status(201).json({ success: true, data: campaign });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}