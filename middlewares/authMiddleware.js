const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ auth: false, message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }
    // console.log("decoded", decoded)
    req.userId = decoded.id;
    req.accessToken = decoded.accessToken;
    next();
  });
};

module.exports = { verifyToken };
