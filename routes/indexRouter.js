const { Router } = require('express');
const indexRouter = Router();
const userController = require('../controllers/userController');
const passport = require('passport');
const bcrypt = require('bcryptjs');

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
  const { firstName, lastName, username, password } = req.body;

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password', err);
      return res.status(500).send('Internal server error');
    }

    await userController.addUser({
      firstName,
      lastName,
      username,
      password: hashedPassword
    })

    res.redirect('/');
  });
});

// indexRouter.post('/sign-up', (req, res, next) => {
//   bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
//     if (err) {
//       return next(err);
//     }
//     try {
//       await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
//         req.body.username,
//         hashedPassword 
//       ]);
//       res.redirect('/');
//     } catch (err) {
//       return next(err);
//     }
//   });
// });

module.exports = indexRouter;