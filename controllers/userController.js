const db = require('../db/queries');

async function addUser(userData) {
  const { firstName, lastName, username, password } = userData;
  await db.addUserQuery(firstName, lastName, username, password)
}

async function isUsernameTaken(username) {
  const user = await db.getUserByUsernameQuery(username);
  return !!user;
}

module.exports = {
  addUser,
  isUsernameTaken
};