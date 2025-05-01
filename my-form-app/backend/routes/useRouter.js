import express from 'express';
import cookieParser from 'cookie-parser';
import { User, Role } from '../index.js'; // Make sure index.js exports all models

const router = express.Router();

// Middleware
router.use(cookieParser());

// routes/useRouter.js
router.post('/register', async (req, res) => {
    try {
      const { email, clerkUserId, first_name, last_name } = req.body;
  
      if (!email || !clerkUserId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const defaultRole = await Role.findOne({ where: { name: 'user' } });
  
      const [user, created] = await User.findOrCreate({
        where: { clerkUserId },
        defaults: {
          username: email,
          email,
          first_name,
          last_name,
          roleId: defaultRole.id
        }
      });
  
      res.cookie('username', email, {
        httpOnly: true,
        sameSite: 'Lax'
      });
  
      if (!created) {
        return res.status(200).json({ message: 'User already exists', user });
      }
  
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.error('❌ Error in /register:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

// Get user role
router.get('/user', async (req, res) => {
  try {
    const username = req.cookies?.username;

    if (!username) {
      return res.status(401).json({ message: 'Unauthorized. No username cookie found.' });
    }

    const user = await User.findOne({
      where: { username },
      include: {
        model: Role,
        attributes: ['name'],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ role: user.Role.name });
  } catch (error) {
    console.error('❌ Error in /user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
