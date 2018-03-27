const knex = require('../dbconnection');

const userSchema = async () => {
  const exists = await knex.schema.hasTable('users');

  if(!exists){
    return await knex.schema.createTable('users', (t) => {
      t.increments('id').primary();
      t.string('firstname', 100).notNullable();
      t.string('lastname', 100).notNullable();
      t.string('email').notNullable().unique();
      t.string('password').notNullable();
    });
  }
}

module.exports = userSchema;
