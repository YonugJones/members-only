const { Router } = require('express');
const indexRouter = Router();
const userController = require('../controllers/userController');

indexRouter.get('/', (req, res) => res.render('index'));
indexRouter.get('/log-in', (req, res) => res.render('log-in-form'));
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form'));
indexRouter.post('/sign-up', (req, res) => {
  userController.addUser(req, res);
})

module.exports = indexRouter;