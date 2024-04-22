const jwt = require('jsonwebtoken');

const generateAuthToken = async (user) => {
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '3h' });
  return token;
}

const verifyAuthToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
}

module.exports = { generateAuthToken, verifyAuthToken };