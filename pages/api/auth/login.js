import dbConnect from '@/lib/dbConnect';
import Business from '@/models/Business';
import { generateToken } from '@/lib/authMiddleware';
import { setCookie } from 'cookies-next';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { email, password } = req.body;

    // Find business
    const business = await Business.findOne({ email }).select('+password');

    if (!business) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await business.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(business._id);

    // Set token as cookie
    setCookie('token', token, { req, res, maxAge: 30 * 24 * 60 * 60 });

    return res.status(200).json({
      success: true,
      data: {
        _id: business._id,
        name: business.name,
        email: business.email,
        token,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}