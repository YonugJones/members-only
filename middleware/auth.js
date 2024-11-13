function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/log-in');
}

function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).send('Forbidden');
}

module.exports = { isAuthenticated, isAdmin };