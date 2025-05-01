// routes/clerkWebhook.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/webhook', async (req, res) => {
  try {
    console.log('📩 Clerk Webhook received:', JSON.stringify(req.body, null, 2));

    const eventType = req.body.type;

    // Only handle 'user.created' event
    if (eventType !== 'user.created') {
      return res.status(400).json({ error: `Unsupported event type: ${eventType}` });
    }

    const { id, email_addresses, first_name, last_name } = req.body.data;

    // Ensure required fields are present
    if (!id || !Array.isArray(email_addresses) || !email_addresses[0]?.email_address || !first_name || !last_name) {
      return res.status(400).json({ error: 'Missing required user data in webhook payload' });
    }

    const email = email_addresses[0].email_address;

    console.log('🧠 Parsed user data:', { id, email, first_name, last_name });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { clerkUserId: id } });
    if (existingUser) {
      console.log('✅ User already exists in DB');
      return res.status(200).json({ message: 'User already exists in DB' });
    }

    // Create new user
    const newUser = await User.create({
      email,
      first_name,
      last_name,
      clerkUserId: id,
    });

    console.log('🎉 New user created in DB:', newUser.toJSON());

    return res.status(201).json({ message: 'User saved to DB', user: newUser });
  } catch (err) {
    console.error('❌ Webhook error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
