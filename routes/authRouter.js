const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('../middleware/passport');
const userController = require('../controllers/userController');

const authRouter = Router();

// Login
authRouter.get('/log-in', (req, res) => res.render('log-in-form'));
authRouter.post('/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in'
  })
);

// Logout
authRouter.get('/log-out', (req, res) => {
  req.logout(() => res.redirect('/'));
});

// Sign-up form
authRouter.get('/sign-up', (req, res) => {
  res.render('sign-up-form', { errors: [], userData: {} });
});

authRouter.post('/sign-up', [
    body('firstName').isAlpha().withMessage('First name should only contain letters.'),
    body('lastName').isAlpha().withMessage('Last name should only contain letters.'),
    body('username').isLength({ min: 2 }).withMessage('Username must be at least 2 characters.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('sign-up-form', { 
        errors: errors.array(), 
        userData: req.body 
      });
    }
    next();
  }, userController.addUser
);

module.exports = authRouter;
