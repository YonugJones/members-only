const db = require('../db/queries');

async function addUser(userData) {
  const { firstName, lastName, username, password } = userData;
  await db.addUserQuery(firstName, lastName, username, password)
}

module.exports = {
  addUser
};