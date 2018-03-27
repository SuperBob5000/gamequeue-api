const typeDefs = `
  type User {
    id: Int
    firstname: String
    lastname: String
    email: String
  },
  type Query {
    getUserByEmail(email: String, token: String) : User
    authenticate(email: String, password: String) : String
  },
`;

module.exports = typeDefs;
