const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  addUser
} = require('../../queries/user');
const verify = require('../../verifyjwt');
require('dotenv').config;

const getUserByEmail = async (args) => {

  const {email, token} = args;

  var verified;
  try {
    verified = await verify(token);
  } catch (err) {
    return err;
  }

  if (verified.email) {
    try {
      return await findUserByEmail(email);
    } catch (err) {
      return err;
    }
  } else {
    return new Error('Token invalid. Please log in.');
  }
}

const createUser = async (args) => {
  const { email, password } = args;

  if (email) {
    try {
      const userExists = await findUserByEmail(email);
      if (userExists) {
        return new Error('User with input email already exists.');
      }
    } catch (err) {
      return err;
    }

    try {
        return await addUser(args);
    } catch (err) {
      return err;
    }
  }
}

const authenticate = async (args) => {
  const {
    email,
    password
  } = args;
  var user;

  if (email) {
    try {
      user = await findUserByEmail(email);
      if (!user) {
        return new Error('User doesn\'t exist.');
      }
    } catch (err) {
      return err;
    }
  }

  try {
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return new Error('Invalid password.');
    }
  } catch (err) {
    return err;
  }

  try {
    const value = await jwt.sign({email: email}, process.env.PRIVATE_KEY, {expiresIn: 86400});
    return value;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getUserByEmail,
  createUser,
  authenticate
};
