const knex = require('../dbconnection');

const dropUserSchema = async () => {
  const exists = await knex.schema.hasTable('users');

  if(exists){
    return await knex.schema.dropTable('users');
  }
}

module.exports = dropUserSchema;
