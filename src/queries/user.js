const knex = require('../dbconnection');

const addUser = async (args) => {
  const {firstname, lastname, email, role, password} = args;

  try {
    return await knex("users").returning('id').insert({firstname, lastname, email, role, password});
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

module.exports = {addUser, findUserById};
