debugger;
const { getIgdbGame, addGame, searchGames, getGameByIgdbId } = require('../../queries/game');
const { findUserByEmail } = require('../../queries/user');
const verify = require('../../verifyjwt');
require('dotenv').config;

const findGames = async (args) => {
  const {name, token} = args;

  var verified;
  try {
    verified = await verify(token);
  } catch (err) {
    return err;
  }

  var user;
  if (verified.email) {
    try {
      user = await findUserByEmail(verified.email);
    } catch (err) {
      return err;
    }
  } else {
    return new Error('Token invalid. Please log in.');
  }

  if(user) {
    var localGames,
    igdbGames,
    allGames = [];

    try {
      localGames = await searchGames(name);
      allGames.push(...localGames);
    } catch (err) {
      return err;
    }

    if(localGames.length < 5) {
      const searchArgs = {
        limit: 5,
        search: name,
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

      try {
        igdbRes = await getIgdbGame(searchArgs, searchValues);
      } catch (err) {
        console.log('An error occured obtaining a game from IGDB: ' + err);
      }

      if(igdbRes.body[0]){
        const igdbGames = igdbRes.body;
        for (var i = 0; i < igdbGames.length; i++) {
          var game;
          try {
            game = await getGameByIgdbId(igdbGames[i].id);
          } catch (err) {
            console.log('An error occured while fetching game from db: ' + err);
          }

          if(!game[0]) {
            const gameArgs = {
              igdb_id: igdbGames[i].id,
              name: igdbGames[i].name,
              summary: igdbGames[i].summary,
              release_date: igdbGames[i].first_release_date,
              critic_rating: igdbGames[i].aggregated_rating,
              cover: igdbGames[i].cover
            }
            try {
              addGame(gameArgs);
            } catch (err) {
              console.log('An error occured while adding game to db: ' + err);
            }

            allGames.push(gameArgs);
          } else {
            allGames.push(game[0]);
          }
        }
      }
    }

    return allGames;

  } else {
    return new Error('User does not exist.');
  }
}

module.exports = findGames;
