const pool = require('./pool');

async function addUserQuery(firstName, lastName, username, password) {
  console.log('running queries adduserQuery');
  await pool.query(
    'INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3, $4)',
    [firstName, lastName, username, password]
  );
  console.log('user insterted succesfully');
}

async function getUserByUsernameQuery(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

module.exports = {
  addUserQuery,
  getUserByUsernameQuery
}