An API to save information of the games you would like to play and order them as such.


query authenticate($email: String!, $password: String!) {
  authenticate(email: $email, password: $password) : String
}

query getUserByEmail($email: String!) {
  getUserByEmail(email: $email) {
    id
    firstname
    lastname
    email
  }
}
