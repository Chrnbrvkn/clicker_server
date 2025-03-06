require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (user) => {
  console.log("JWT_SECRET: ", JWT_SECRET); 
  console.log("Generate token for user: " + JSON.stringify(user));
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
};

module.exports = { generateToken };
