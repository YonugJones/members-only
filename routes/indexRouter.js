const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const passport = require('passport');

const indexRouter = Router();

// GET routes
indexRouter.get('/', (req, res) => res.render('index', { user: req.user }));
indexRouter.get('/log-in', (req, res) => res.render('log-in-form'));
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form', { errors: [], userData: {} }));
indexRouter.get('/membership-code', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/log-in');
  }
  res.render('membership-code', { errorMessage: '' });
});

// POST routes
indexRouter.post('/log-in', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in'
  })
);

indexRouter.post('/sign-up', [
    body('firstName').isAlpha().withMessage('First name should only contain letters.'),
    body('lastName').isAlpha().withMessage('Last name should only contain letters.'),
    body('username').isLength({ min: 2 }).withMessage('Username must be at least 2 characters.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match')
      }
      return true;
    })
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.render('sign-up-form', { errors: errors.array() });
    }
    next();
  }, userController.addUser
)

indexRouter.post('/membership-code', userController.checkMembership);

indexRouter.get('/log-out', (req, res) => {
  req.logout(() => res.redirect('/'));
})

module.exports = indexRouter;