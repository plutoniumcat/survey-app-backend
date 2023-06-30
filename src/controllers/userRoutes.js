const express = require('express');
const userRouter = express.Router();
const {User} = require('../models/userModel')
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;


userRouter.post("/verify-token", async (request, response) => {
  const { authorization } = request.headers;
  
  // Extract the token from the Authorization header
  const token = authorization.split(' ')[1];

  try {
    // Verify the token
    jwt.verify(token, secretKey);

    // Token is valid
    response.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    // Token is invalid or expired
    response.status(401).json({ error: 'Token is invalid or expired' });
  }
});



userRouter.post("/login", async (request, response) => {
    const { username, password } = request.body;

    try {
      // Find the user in the database by username
      const user = await User.findOne({ username });
  
      if (!user) {
        // User not found
        return response.status(401).json({ error: 'Authentication failed: Invalid username' });
      }
  
      // Compare the password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        // Passwords don't match
        return response.status(401).json({ error: 'Authentication failed: Invalid password' });
      }
  
      const token = jwt.sign({ username: user.username }, `${secretKey}`, { expiresIn: '1h' });

      return response.status(200).json({ 
        message: 'Login successful',
        token: token 
      });

    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Server error' });
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
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return response.status(400).json({ error: 'Username already exists' });
      }

      const existingEmail = await User.findOne({ email: email });
      if (existingEmail) {
        return response.status(400).json({ error: 'Email already exists' });
      }

      if (!validator.isEmail(email)) {
        return response.status(400).json({ error: 'Invalid email format.' });
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        return response.status(400).json({ error: 'Invalid password format. It should contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.' });
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