require("dotenv").config();

const jwt = require("jsonwebtoken");


const generateAccessToken = async (payload) => {
  console.log("generating access token");
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
};

module.exports = generateAccessToken;