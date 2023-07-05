const express = require('express');
const userRouter = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');

userRouter.post("/login", async (request, response) => {
    const { username, password } = request.body;
  
    try {
      // Find the user in the database by username
      const user = await User.findOne({ username });
  
      if (!user) {
        // User not found
        return response.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        // Passwords don't match
        return response.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Passwords match, user authenticated
      console.log('Login successful');
      response.json({ message: 'Login successful' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Server error' });
    }
  });
  
  

userRouter.get("/dashboard", async (request, response) => {
    // TODO Add functionality
    response.json({
        message:"Admin dash"
    });
});

userRouter.post("/register", async (request, response) => {
    const { username, password, email } = request.body;
  
    try {
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return response.status(400).json({ error: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
      });
  
      // Save the new user in the database
      await newUser.save();
  
      // Send a success response
      response.json({ message: 'Registration successful' });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Server error' });
    }
});


module.exports = userRouter;