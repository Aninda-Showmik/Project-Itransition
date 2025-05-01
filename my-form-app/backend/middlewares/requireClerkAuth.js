// middlewares/requireClerkAuth.js
import { verifyToken } from '@clerk/backend'; // Directly import verifyToken from @clerk/backend

const requireClerkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("⚠️ Missing Authorization header");
    return res.status(401).json({ message: 'Missing auth header' });
  }

  const token = authHeader.replace('Bearer ', ''); // Extract the token from Bearer scheme

  try {
    // Optional: Debug log to confirm secret key is loaded
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("❌ CLERK_SECRET_KEY not set in environment");
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    // Verify the token using Clerk's secret key
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY, // Clerk secret key from environment
    });

    // Attach user ID from payload to request for further use
    req.auth = { userId: payload.sub };

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    console.error("❌ Clerk token verification failed:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default requireClerkAuth;
