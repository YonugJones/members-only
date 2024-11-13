const db = require('../db/queries');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

async function getAllMessages(req, res) {
  try {
    const messages = await db.getAllMessagesQuery();
    res.render('index', { user: req.user, messages })
  } catch (err) {
    console.error('Error fetching messages', err);
    res.status(500).send('Internal server error');
  }
}

async function addUser(req, res) {
  const { firstName, lastName, username, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const isAdminValue = isAdmin === 'on' ? true : false;


    const existingUser = await db.getUserByUsernameQuery(username);
    if (existingUser) {
      const errors = validationResult(req);
      console.log(errors);
      errors.errors.push({
        msg: 'Username already taken',
        path: 'username'
      });

      console.log(errors);

      return res.render('sign-up-form', { 
        errors: errors.array(), 
        userData: req.body 
      });
    }

    await db.addUserQuery(firstName, lastName, username, hashedPassword, isAdminValue);
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

async function createMessage(req, res) {
  const { message } = req.body;
  const userId = req.user.id;
  const date = new Date();

  try {
    await db.createMessageQuery(userId, message, date);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding message', err)
    res.status(500).send('Internal server error')
  }
}

async function deleteMessage(req, res) {
  const { id } = req.params;

  try {
    await db.deleteMessageQuery(id);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting message', err);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  getAllMessages,
  addUser,
  checkMembership,
  createMessage,
  deleteMessage
};