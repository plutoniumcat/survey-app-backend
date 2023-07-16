const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const verifyToken = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authorization.split(' ')[1];

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    return response.status(401).json({ error: 'Unauthorized: Invalid token or expired' });
  }
};

module.exports = verifyToken;