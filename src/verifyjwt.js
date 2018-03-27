const jwt = require('jsonwebtoken');
require('dotenv').config;

const verify = async (token) => {
  try {
    return await jwt.verify(token, process.env.PRIVATE_KEY);
  } catch (err) {
    return err;
  }
}

module.exports = verify;
