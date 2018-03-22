require('dotenv').config;
process.env.DB_NAME = 'gamequeue_TEST';
const assert = require('chai').assert;
const userSchema = require('../src/tables/userSchema.js');
const dropUserSchema = require('../src/tables/dropUserSchema.js');
const knex = require('../src/dbconnection');
const {addUser, findUserById} = require('../src/queries/user.js');

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
    it('Create user', async function() {
      const args = {
        firstname: 'Danny',
        lastname: 'Dankman',
        email: 'cheese@cheese.com',
        password: 'WhereTheCheeseAt',
        role: 'admin'
      };
      const userID = await addUser(args);
      assert.equal(userID, 1, 'ID should be 1');

      const user = await findUserById(userID[0]);
      assert.equal(user[0].id, 1);
      assert.equal(user[0].firstname, 'Danny');
      assert.equal(user[0].lastname, 'Dankman');
      assert.equal(user[0].email, 'cheese@cheese.com');
      assert.equal(user[0].password, 'WhereTheCheeseAt');
      assert.equal(user[0].role, 'admin');
    });
  });

  after(async function() {
    await knex.destroy();
  });
});
