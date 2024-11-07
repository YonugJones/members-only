const db = require('../db/queries');
const bcrypt = require('bcryptjs');

async function addUser(req, res) {
  const { firstName, lastName, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.addUserQuery(firstName, lastName, username, hashedPassword);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding user', err);
    res.status(500).send('Internal server error');
  }
}

async function checkMembership(req, res) {
  const { passcode } = req.body;
  const correctPasscode = process.env.MEMBERSHIP_PASSCODE;

  if (passcode === correctPasscode) {
    try {
      await db.updateMembershipStatusQuery(req.user.id, true);
      res.redirect('/');
    } catch (err) {
      console.error('Error updating membership status', err);
      res.render('membership-code', { errorMessage: 'An error occured. Please try again.' })
    }
  } else {
    res.render('membership-code', { errorMessage: 'Incorrect passcode. Please try again.' })
  }
}

module.exports = {
  addUser,
  checkMembership
};