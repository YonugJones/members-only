const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const indexRouter = Router();
const userController = require('../controllers/userController');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const db = require('../db/queries')

// GET routes
indexRouter.get('/', (req, res) => res.render('index', { user: req.user }));
indexRouter.get('/log-in', (req, res) => res.render('log-in-form'));
indexRouter.get('/sign-up', (req, res) => {
  res.render('sign-up-form', { userData: {}, errors: [] })
});
indexRouter.get('/membership-code', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/log-in');
  }
  res.render('membership-code', { errorMessage: '' })
});

// POST log-in
indexRouter.post('/log-in', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

// POST membership-code form
indexRouter.post('/membership-code', async (req, res) => {
  const { passcode } = req.body;
  const userId = req.user.id;

  const correctPasscode = process.env.MEMBERSHIP_PASSCODE;

  if (passcode === correctPasscode) {
    try {
      await db.updateMembershipStatusQuery(userId, true);
      const updatedUser = await db.getUserByUsernameQuery(userId);
      req.user = updatedUser;
      res.redirect('/');
    } catch (err) {
      console.error('Error updating membership status', err);
      res.render('membership-code', { errorMessage: 'An error occured. Please try again.' });
    }
  } else {
    res.render('membership-code', { errorMessage: 'Invalid passcode. Please try again.' });
  }
})


// log-out route
indexRouter.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/');
  })
});

// POST sign-up with sanitization and validation
indexRouter.post(
  '/sign-up', 
  [
    body('firstName').trim().isAlpha().escape().withMessage('First name should only contain letters'),
    body('lastName').trim().isAlpha().escape().withMessage('Last name should only contain letters'),
    body('username').trim().isLength({ min: 2 }).escape().withMessage('Username must be at least 2 characters.')
      .custom(async (username) => {
        const isTaken = await userController.isUsernameTaken(username);
        if (isTaken) {
          throw new Error('Username already taken')
        }
      }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true;
    })
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array())
      return res.render('sign-up-form', {
        errors: errors.array(),
        userData: req.body
      });
    }

    const { firstName, lastName, username, password } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        return res.status(500).send('Internal server error');
      }

      try {
        await userController.addUser({
          firstName,
          lastName,
          username,
          password: hashedPassword
        });
        res.redirect('/');
      } catch (err) {
        console.error('Error adding user to database:', err);
        res.status(500).send('Internal server error');
      }
  });
});

module.exports = indexRouter;