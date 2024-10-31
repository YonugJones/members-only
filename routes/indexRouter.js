const { Router } = require('express');
const indexRouter = Router();
const userController = require('../controllers/userController');
const passport = require('passport');

indexRouter.get('/', (req, res) => {
  res.render('index', { user: req.user })
});
indexRouter.get('/log-in', (req, res) => res.render('log-in-form'));
indexRouter.post('/log-in', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);
indexRouter.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/');
  })
})
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form'));
indexRouter.post('/sign-up', (req, res) => {
  userController.addUser(req, res);
});


module.exports = indexRouter;