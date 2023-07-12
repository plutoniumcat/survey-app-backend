const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

const verifyToken = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    return response.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = verifyToken;
