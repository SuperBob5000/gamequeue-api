require('dotenv').config;
process.env.DB_NAME = 'gamequeue_TEST';
const assert = require('chai').assert;
const getIgdbGame = require('../src/queries/game.js');

describe('Game', function() {
  it('Should get game from igdb', async function() {
    this.timeout(1000);
    const searchArgs = {
      limit: 3,
      search: 'Timesplitters',
      offset: 0,
      order: 'release_dates.date:desc',
      category: 0
    };

    const searchValues = [
      'name'
    ];

    const response = await getIgdbGame(searchArgs, searchValues);
    const body = response.body;

    assert.equal(body.length, 3, 'Array size should be 3');
    assert.isNumber(body[0].id);
    assert.isString(body[0].name);
  });
});
