require('dotenv').config;
process.env.DB_NAME = 'gamequeue_TEST';
const assert = require('chai').assert;
const knex = require('../src/dbconnection');
const gameSchema = require('../src/tables/gameSchema.js');
const dropGameSchema = require('../src/tables/dropGameSchema.js');
const {getIgdbGame, addGame, getGameById, searchGames} = require('../src/queries/game.js');

describe('Game', function() {
  before(async function() {
    await dropGameSchema();
  });

  it('Create table if it doesn\'t exist', async function() {
    var hasTable = await knex.schema.hasTable('game');
    assert.equal(hasTable, false, 'Users table should not exist');

    await gameSchema();
    hasTable = await knex.schema.hasTable('game');
    assert.equal(hasTable, true, 'Users table should now exist');
  });

  it('Should get game from igdb and then add to postgres db', async function() {
    const searchArgs = {
      limit: 3,
      search: 'Timesplitters',
      offset: 0,
      order: 'release_dates.date:desc',
      category: 0
    };

    const searchValues = [
      'name',
      'summary',
      'rating',
      'aggregated_rating',
      'cover'
    ];

    const response = await getIgdbGame(searchArgs, searchValues);
    const body = response.body;

    assert.equal(body.length, 3, 'Array size should be 3');
    assert.isNumber(body[0].id);
    assert.isString(body[0].name);

    const args = {
      igdb_id: body[1].id,
      name: body[1].name,
      summary: body[1].summary,
      rating: body[1].rating,
      critic_rating: body[1].aggregated_rating,
      cover: body[1].cover
    }

    const id = await addGame(args);
    assert.isNumber(id[0]);

    const game = await getGameById(id[0]);
    assert.isString(game[0].name);
    assert.isNumber(game[0].id);
    assert.isString(game[0].summary);
    assert.equal(game[0].name, 'TimeSplitters: Future Perfect');

  });

  it('Should return game with loose search.', async function() {
    const response = await searchGames('Time');
    assert.exists(response[0]);
    assert.equal(response[0].name, 'TimeSplitters: Future Perfect');
  });
});
