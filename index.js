const express = require('express');
const expressGraphql = require('express-graphql');
const {buildSchema} = require('graphql');
const typeDefs = require('./src/graphql/typedefs');
const {addUser, findUserByEmail} = require('./src/queries/user');
const {getUserByEmail, createUser, authenticate} = require('./src/graphql/resolvers/users');
const {findGames, associateGameWithUser, findGamesByUserId} = require('./src/graphql/resolvers/games');
const userSchema = require('./src/tables/userSchema');
const gameSchema = require('./src/tables/gameSchema');
const userGameSchema = require('./src/tables/userGameSchema');
require('dotenv').config;

const initialiseData = async () => {
  await userSchema();
  await gameSchema();
  await userGameSchema();

  const admin = await findUserByEmail(process.env.ADMIN_EMAIL);
  if(!admin) {
    const args = {
      firstname: 'admin',
      lastname: 'adminson',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PW
    }
    await addUser(args);
  }
}

initialiseData();

const schema = buildSchema(typeDefs);
const root = {
  getUserByEmail: getUserByEmail,
  authenticate: authenticate,
  createUser: createUser,
  findGames: findGames,
  associateGameWithUser: associateGameWithUser,
  findGamesByUserId: findGamesByUserId
}

const app = express();
app.use('/graphql', expressGraphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
