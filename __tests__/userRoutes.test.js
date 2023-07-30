const request = require('supertest');
const { app } = require('../src/server');
const { User } = require('../src/models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();
const secretKey = process.env.SECRET_KEY;

// Mock the User.findOne function to return a mock user or null
jest.mock('../src/models/userModel');
User.findOne.mockImplementation(async ({ username }) => {
  // Create a map of valid usernames and corresponding user objects
  const validUserMap = {
    TestUser4: {
      _id: '64b9d6b735c362a6ad0038a1',
      username: 'TestUser4',
      password: '$2b$10$mypx.WfamJnbXHGZamUdpu6MJCZ3xgkpi9b5YNcasaiExHAUuh4ni',
    },
  };

  // Check if the username exists in the validUserMap
  if (validUserMap.hasOwnProperty(username)) {
    return validUserMap[username];
  }

  // If the username is not found in the map, return null
  return null;
});

describe('POST /admin/login', () => {
  it('should login successfully', async () => {
    // Remaining test code is the same as before...
  });

  it('should handle invalid username', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send({ username: 'invaliduser', password: 'validpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed: Invalid username');
  });

  it('should handle incorrect password', async () => {
    const response = await request(app)
      .post('/admin/login')
      .send({ username: 'TestUser4', password: 'incorrectpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed: Incorrect password');
  });

  it('should handle server error', async () => {
    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error('Mocked error'));

    const response = await request(app)
      .post('/admin/login')
      .send({ username: 'TestUser4', password: 'TestUser4' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Server error');
  });
});
