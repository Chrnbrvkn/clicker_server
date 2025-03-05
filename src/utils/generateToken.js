const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET
const JWT_SECRET = "e419368cb0533ba3f9d895a8f3949c01466a0440813d443d9efbbca25844427f"

const generateToken = (user) => {
  console.log('jwtUtils.js ' + JSON.stringify(user));
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
};

module.exports = { generateToken };
