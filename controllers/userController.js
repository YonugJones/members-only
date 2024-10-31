const db = require('../db/queries');

async function addUser(req, res) {
  try {
    const { firstName, lastName, username, password } = req.body;
    await db.addUserQuery(firstName, lastName, username, password)
    res.redirect('/');
  } catch (err) {
    console.error('Error adding user to database:', err);
    res.status(500).send('Internal server error')
  }
}

module.exports = {
  addUser
}