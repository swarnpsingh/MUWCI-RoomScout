import express from 'express';
const router = express.Router();
import User from "../models/User.js";

// Signup route
router.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, username, password });
    await user.save();

    // Return user object with the response
    res.status(201).json({ message: 'User created successfully', user: { name: user.name, username: user.username } });
  } catch (err) {
    console.error('Signup Error:', err); // Log the error details
    res.status(500).json({ message: 'Server error', error: err.message }); // Include error message
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Return user object with the response
    res.status(200).json({ message: 'Login successful', user: { name: user.name, username: user.username } });
  } catch (err) {
    console.error('Login Error:', err); // Log the error details
    res.status(500).json({ message: 'Server error', error: err.message }); // Include error message
  }
});

// Export the router
export default router;
