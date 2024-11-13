const { Router } = require('express');
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

const indexRouter = Router();

// Main page showing all messages
indexRouter.get('/', userController.getAllMessages);

// Membership code form (protected)
indexRouter.get('/membership-code', isAuthenticated, (req, res) => {
  res.render('membership-code', { errorMessage: '' });
});
indexRouter.post('/membership-code', isAuthenticated, userController.checkMembership);

// New message form (protected)
indexRouter.get('/new-message', isAuthenticated, (req, res) => {
  res.render('new-message-form');
});
indexRouter.post('/new-message', isAuthenticated, userController.createMessage);

module.exports = indexRouter;
