const knex = require('../dbconnection');

const gameSchema = async () => {
  const exists = await knex.schema.hasTable('game');

  if(!exists){
    return await knex.schema.createTable('game', (t) => {
      t.increments('id').primary();
      t.integer('user_id').notNullable();
      t.integer('game_id').notNullable();
    });
  }
}

module.exports = gameSchema;
