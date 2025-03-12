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
    const { name, email, password } = req.body;

    // Check if business exists
    const businessExists = await Business.findOne({ email });

    if (businessExists) {
      return res.status(400).json({ success: false, message: 'Business already exists' });
    }

    // Create business
    const business = await Business.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(business._id);

    // Set token as cookie
    setCookie('token', token, { req, res, maxAge: 30 * 24 * 60 * 60 });

    return res.status(201).json({
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