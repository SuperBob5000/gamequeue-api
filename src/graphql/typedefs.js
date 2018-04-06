const typeDefs = `
  type User {
    id: Int
    firstname: String
    lastname: String
    email: String
  },
  type Game {
    name: String
    summary: String
    release_date: Int
    criting_rating: Float
  },
  input UserInput {
    firstname: String!
    lastname: String!
    password: String!
    email: String!
  },
  type Query {
    getUserByEmail(email: String, token: String) : User
    authenticate(email: String, password: String) : String
    findGames(name: String, token: String) : [Game]
    findGamesByUserId(token: String) : [Game]
  },
  type Mutation {
    createUser(userInput: UserInput) : Int
    associateGameWithUser(gameId: Int, igdbId: Int, token: String) : Int
  }
`;

module.exports = typeDefs;
