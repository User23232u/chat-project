const User = require('../models/User');
const { verifyAuthToken } = require('../jwt/authToken');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || !authHeader.startsWith('Bearer ')) return res.sendStatus(401);

  const decoded = verifyAuthToken(token);
  if (!decoded) return res.sendStatus(403);

  req.user = await User.findById(decoded._id);
  if (!req.user) return res.sendStatus(404);

  next();
};