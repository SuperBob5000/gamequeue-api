const { getIgdbGame, addGame, searchGames, getGameByIgdbId, userGameAssociation, getUserAssociationsByUserId, getGameById } = require('../../queries/game');
const { findUserByEmail } = require('../../queries/user');
const verify = require('../../verifyjwt');
require('dotenv').config;

const findGames = async (args) => {
  const {name, token} = args;

  const user = await verifyTokenAndGetUser(token);

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

const associateGameWithUser = async (args) => {
  const { gameId, token, igdbId } = args;

  const user = await verifyTokenAndGetUser(token);

  if(user) {
    try {
      if(gameId || igdbId) {
        return await userGameAssociation({userId: user.id, gameId, igdbId});
      } else {
        return new Error("There must be at least one game id input.");
      }
    } catch (err) {
      return err;
    }
  }
}

const findGamesByUserId = async (args) => {
  const user = await verifyTokenAndGetUser(args.token);
  var games = [];

  if(user) {
    var gameUserAssociations;
    try {
       gameUserAssociations = await getUserAssociationsByUserId(user.id);
    } catch (err) {
      return err;
    }

    if(gameUserAssociations[0]) {
      for (i = 0; i < gameUserAssociations.length; i++) {
        const gameId = gameUserAssociations[i].game_id,
        igdbId = gameUserAssociations[i].igdb_id;
        if (gameId) {
          try {
            const game = await getGameById(gameId);
            games.push(game[0]);
          } catch (err) {
            console.log("Cannot obtain game with id " + gameId);
          }
        } else if (igdbId) {
          try {
            const game = await getGameByIgdbId(igdbId);
            games.push(game[0]);
          } catch (err) {
            console.log("Cannot obtain game with igdb_id " + igdbId);
          }
        }
      }
    }
  }

  return games;
}

const verifyTokenAndGetUser = async (token) => {
  var verified;
  try {
    verified = await verify(token);
  } catch (err) {
    return err;
  }

  if (verified.email) {
    try {
      return await findUserByEmail(verified.email);
    } catch (err) {
      return err;
    }
  } else {
    return new Error('Token invalid. Please log in.');
  }
}

module.exports = {findGames, associateGameWithUser, findGamesByUserId};
