// utils/clerkUtils.js
require('dotenv').config();
const { verifyToken: clerkVerifyToken } = require('@clerk/backend');

const verifyToken = async (token) => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not set in environment variables");
  }

  const payload = await clerkVerifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  return {
    userId: payload.sub,
  };
};

module.exports = { verifyToken };
