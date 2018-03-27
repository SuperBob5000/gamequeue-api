const knex = require('../dbconnection');
const argon2 = require('argon2');

const addUser = async (args) => {
  var {firstname, lastname, email, password} = args;
  try {
    password = await argon2.hash(password);
  } catch (err) {
    return err
  }

  try {
    return await knex("users").returning('id').insert({firstname, lastname, email, password});
  } catch(err) {
    return err;
  }
}

const findUserById = async (id) => {
  try{
    return await knex('users').where('id', id);
  } catch (err) {
    return err;
  }
}

const findUserByEmail = async (email) => {
  try{
    const value = await knex('users').where('email', email);
    return value[0];
  } catch (err) {
    return err;
  }
}

module.exports = {addUser, findUserById, findUserByEmail};
