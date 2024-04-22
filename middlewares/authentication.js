const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access denied. No token provided or invalid format.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = authenticate;
