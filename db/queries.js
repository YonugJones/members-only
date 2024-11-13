const pool = require('./pool');

async function addUserQuery(firstName, lastName, username, password, isAdmin) {
  await pool.query(
    'INSERT INTO users (firstName, lastName, username, password, isAdmin) VALUES ($1, $2, $3, $4, $5)',
    [firstName, lastName, username, password, isAdmin]
  );
}

async function getUserByUsernameQuery(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

async function updateMembershipStatusQuery(userId, status) {
  await pool.query('UPDATE users SET membershipStatus = $1 WHERE id = $2', [status, userId])
}

async function createMessageQuery(userId, message, date) {
  await pool.query('INSERT INTO messages (userId, message, date) VALUES ($1, $2, $3)', 
    [userId, message, date]
  )
}

async function deleteMessageQuery(messageId) {
  await pool.query('DELETE FROM messages where id = $1', [messageId])
}

async function getAllMessagesQuery() {
  const result = await pool.query(
    'SELECT messages.id, messages.message, messages.date, users.username FROM messages JOIN users ON messages.userid = users.id ORDER BY messages.date DESC'
  );
  return result.rows;
}

module.exports = {
  addUserQuery,
  getUserByUsernameQuery,
  updateMembershipStatusQuery,
  createMessageQuery,
  deleteMessageQuery,
  getAllMessagesQuery
}