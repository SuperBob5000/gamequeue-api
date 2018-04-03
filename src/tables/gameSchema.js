const knex = require('../dbconnection');

const gameSchema = async () => {
  const exists = await knex.schema.hasTable('game');

  if(!exists){
    return await knex.schema.createTable('game', (t) => {
      t.increments('id').primary();
      t.string('name', 100).notNullable();
      t.string('summary', 1000);
      t.date('release_date');
      t.integer('igdb_id').notNullable();
      t.decimal('rating');
      t.decimal('critic_rating');
      t.json('cover');
    });
  }
}

module.exports = gameSchema;
