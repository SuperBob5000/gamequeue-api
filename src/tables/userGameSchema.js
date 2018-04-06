const knex = require('../dbconnection');

const userGameSchema = async () => {
  const exists = await knex.schema.hasTable('user_game');

  if(!exists){
    return await knex.schema.createTable('user_game', (t) => {
      t.increments('id').primary();
      t.integer('user_id').notNullable();
      t.integer('game_id');
      t.integer('igdb_id');
    });
  }
}

module.exports = userGameSchema;
