const express = require('express');
const router = express.Router();
const { signUpUser } = require('../userController');  // Correct path to userController

router.post('/signup', async (req, res) => {
    const userData = req.body;  // User data sent in the POST request

    // Ensure that userData has all the required fields
    console.log('User data received:', userData);

    try {
        const newUser = await signUpUser(userData);  // Call the function to insert data
        res.status(201).json(newUser);  // Respond with the created user
    } catch (error) {
        res.status(500).json({ error: 'Error signing up user' });
    }
});

module.exports = router;
