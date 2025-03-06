const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (user) => {
  console.log('jwtUtils.js ' + JSON.stringify(user));
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
};

module.exports = { generateToken };
