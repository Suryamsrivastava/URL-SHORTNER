const jwt = require("jsonwebtoken");
require("dotenv").config();

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name, 
      email: user.email,
    },
    process.env.secret
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.secret);
    return decoded;
  } catch (error) {
    console.error("JWT Error:", error.message);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
