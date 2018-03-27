require('dotenv').config;
process.env.DB_NAME = 'gamequeue_TEST';
const assert = require('chai').assert;
const userSchema = require('../src/tables/userSchema.js');
const dropUserSchema = require('../src/tables/dropUserSchema.js');
const {createUser, authenticate, getUserByEmail} = require('../src/graphql/resolvers/users');
const verify = require('../src/verifyjwt');
const knex = require('../src/dbconnection');
const {addUser, findUserById, findUserByEmail} = require('../src/queries/user.js');
const argon2 = require('argon2');


describe('User', function() {
  before(async function() {
    await dropUserSchema();
  })

  describe('Create table', function() {
    it('Create table if it doesn\'t exist', async function() {
      var hasTable = await knex.schema.hasTable('users');
      assert.equal(hasTable, false, 'Users table should not exist');

      await userSchema();
      hasTable = await knex.schema.hasTable('users');
      assert.equal(hasTable, true, 'Users table should now exist');
    });
  });

  describe('CRUD user', function() {
    it('Create user and find', async function() {
      const args = {
        firstname: 'Danny',
        lastname: 'Dankman',
        email: 'cheese@cheese.com',
        password: 'WhereTheCheeseAt'
      };
      const userID = await addUser(args);
      assert.equal(userID, 1, 'ID should be 1');

      const user = await findUserById(userID[0]);
      assert.equal(user[0].id, 1);
      assert.equal(user[0].firstname, 'Danny');
      assert.equal(user[0].lastname, 'Dankman');
      assert.equal(user[0].email, 'cheese@cheese.com');

      const sameUser = await findUserByEmail('cheese@cheese.com');
      assert.equal(sameUser.id, 1);
      assert.equal(sameUser.firstname, 'Danny');
      assert.equal(sameUser.lastname, 'Dankman');
      assert.equal(sameUser.email, 'cheese@cheese.com');
    });

    it('Create user and hash password via resolver', async function() {
      const args = {
        firstname: 'Pendleton',
        lastname: 'Pimp',
        email: 'pendleton@pimp.com',
        password: 'WhereTheCheeseAt',
      };

      const id = await createUser(args);
      const user = await findUserById(id[0]);



      const valid = await argon2.verify(user[0].password, 'WhereTheCheeseAt');
      assert.equal(valid, true);
    });

    it('Authenticate user', async function() {
      const args = {
        email: 'pendleton@pimp.com',
        password: 'WhereTheCheeseAt'
      };

      const authenticated = await authenticate(args);
      const verified = await verify(authenticated);
      assert.equal(verified.email, 'pendleton@pimp.com');
    });

    it('Find User using resolver', async function() {
      const authenticated = await authenticate({email: 'pendleton@pimp.com', password: 'WhereTheCheeseAt'});

      const userResolver = await getUserByEmail({email: 'cheese@cheese.com', token: authenticated});
      assert.equal(userResolver.id, 1);
      assert.equal(userResolver.firstname, 'Danny');
      assert.equal(userResolver.lastname, 'Dankman');
      assert.equal(userResolver.email, 'cheese@cheese.com');
    })
  });

  after(async function() {
    await knex.destroy();
  });
});
