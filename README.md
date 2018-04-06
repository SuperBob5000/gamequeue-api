An API to save information of the games you would like to play(ed).


query authenticate($email: String!, $password: String!) {
  authenticate(email: $email, password: $password)
}

query getUserByEmail($email: String!, $token: String!) {
  getUserByEmail(email: $email, token: $token) {
    id
    firstname
    lastname
    email
  }
}

query findGames($name: String!, $token: String!) {
  findGames(name: $name, token: $token){
    name
    summary
    release_date
    criting_rating
  }
}

query findGamesByUserId($token: String!) {
  findGamesByUserId(token: $token){
    name
    summary
    release_date
    criting_rating
  }
}

mutation {
    createUser(userInput: {
      firstname: $firstname,
      lastname: $lastname,
      password: $password,
      email: $email
    })
}

mutation {
  associateGameWithUser(gameId, igdb, token)
}
