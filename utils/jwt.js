import jwt from 'jsonwebtoken';

const JWT = {};

/*--------- Header Format: (key value) Authorization : Bearer <Token> ---------*/

// Generate a JWT for a given user
JWT.generateJwtToken = async (user) => {
  return await jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
};

// Middleware to verify JWT token from Authorization header
JWT.verifyJwtToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Access Denied: No Token Provided' });
  }

  const bearerToken = bearerHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

export default JWT;