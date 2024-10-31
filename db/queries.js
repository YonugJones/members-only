const pool = require('./pool');

async function addUserQuery(firstName, lastName, username, password) {
  console.log('running queries adduserQuery');
  await pool.query(
    'INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3, $4)',
    [firstName, lastName, username, password]
  );
  console.log('user insterted succesfully');
}

module.exports = {
  addUserQuery
}