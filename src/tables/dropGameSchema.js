const knex = require('../dbconnection');

const dropGameSchema = async () => {
  const exists = await knex.schema.hasTable('game');

  if(exists){
    return await knex.schema.dropTable('game');
  }
}

module.exports = dropGameSchema;
