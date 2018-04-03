require('dotenv').config;
const igdb = require('igdb-api-node').default;
const knex = require('../dbconnection');

const getIgdbGame = async (searchArgs, searchValues) => {
  const client = igdb(process.env.IGDB_KEY);

  try {
    return await client.games(searchArgs, searchValues);
  } catch (err) {
    return err;
  }
}

const addGame = async (args) => {
  const {name, summary, release_date, igdb_id, rating, critic_rating, cover} = args;

  try {
    return await knex("game").returning('id').insert({
      name, summary, release_date, igdb_id, rating, critic_rating, cover});
  } catch(err) {
    return err;
  }
}

const getGameById = async (id) => {
  try{
    return await knex('game').where('id', id);
  } catch (err) {
    return err;
  }
}

const searchGames = async (name) => {
  try {
    return await knex('game').where('name', 'like', '%' + name + '%');
  } catch (err) {
    return err;
  }
}

module.exports = { getIgdbGame, addGame, getGameById, searchGames };
