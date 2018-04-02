require('dotenv').config;
const igdb = require('igdb-api-node').default;

const getIgdbGame = async (searchArgs, searchValues) => {
  const client = igdb(process.env.IGDB_KEY);

  try {
    return await client.games(searchArgs, searchValues);
  } catch (err) {
    return err;
  }
}

module.exports = getIgdbGame;
