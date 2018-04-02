An API to save information of the games you would like to play and order them as such.


query authenticate($email: String!, $password: String!) {
  authenticate(email: $email, password: $password) : String
}

query getUserByEmail($email: String!, $token: String!) {
  getUserByEmail(email: $email, token: $token) {
    id
    firstname
    lastname
    email
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
