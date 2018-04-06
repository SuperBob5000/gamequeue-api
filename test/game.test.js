require('dotenv').config;
process.env.DB_NAME = 'gamequeue_TEST';
const assert = require('chai').assert;
const knex = require('../src/dbconnection');
const gameSchema = require('../src/tables/gameSchema');
const dropGameSchema = require('../src/tables/dropGameSchema');
const userSchema = require('../src/tables/userSchema');
const dropUserSchema = require('../src/tables/dropUserSchema');
const userGameSchema = require('../src/tables/userGameSchema');
const dropUserGameSchema = require('../src/tables/dropUserGameSchema');
const {authenticate, createUser} = require('../src/graphql/resolvers/users');
const {getIgdbGame, addGame, getGameById, searchGames} = require('../src/queries/game');
const {findGames, associateGameWithUser, findGamesByUserId} = require('../src/graphql/resolvers/games');
const madge = require('madge');

describe('Game CRUD and Resolver methods', function() {
  before(async function() {

    await dropGameSchema();
    await dropUserSchema();
    await dropUserGameSchema();
    await userSchema();
    await userGameSchema();

    const args = {
      userInput: {
        firstname: 'Admin',
        lastname: 'Adminson',
        email: 'admin@admin.com',
        password: 'WhereTheCheeseAt'
      }
    };

    await createUser(args);
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

  it('Should find games and add them if they do not exist in local db',  async function() {
    var response = await searchGames('Time');
    assert.equal(response.length, 1);

    const token = await authenticate({email: 'admin@admin.com', password: 'WhereTheCheeseAt'});
    const games = await findGames({name: 'Timesplitters', token: token});
    assert.equal(games.length, 5);

    response = await searchGames('Time');
    assert.equal(response.length, 5);
  });

  it('Should associate a game with a user', async function() {
    const token = await authenticate({email: 'admin@admin.com', password: 'WhereTheCheeseAt'});
    const args = {
      gameId: 1,
      token: token
    }
    const id = await associateGameWithUser(args);
    assert.isNumber(id[0]);

    const games = await findGamesByUserId({token});
    assert.exists(games[0]);
  });
});
