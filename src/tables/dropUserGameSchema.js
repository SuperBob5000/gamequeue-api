const knex = require('../dbconnection');

const dropUserGameSchema = async () => {
  const exists = await knex.schema.hasTable('user_game');

  if(exists){
    return await knex.schema.dropTable('user_game');
  }
}

module.exports = dropUserGameSchema;
