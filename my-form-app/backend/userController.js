const { User } = require('../models');

async function signUpUser(userData) {
    try {
        // Check if email already exists
        const existingEmail = await User.findOne({ where: { email: userData.email } });
        if (existingEmail) {
            console.log('Email already exists');
            throw new Error('Email is already taken.');
        }

        // Check if clerkUserId already exists
        const existingClerkUserId = await User.findOne({ where: { clerkUserId: userData.clerkUserId } });
        if (existingClerkUserId) {
            console.log('ClerkUserId already exists');
            throw new Error('ClerkUserId is already taken.');
        }

        // Insert the new user
        const newUser = await User.create(userData);
        console.log('User created:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;  // Throw error to be caught in the route handler
    }
}

module.exports = { signUpUser };
