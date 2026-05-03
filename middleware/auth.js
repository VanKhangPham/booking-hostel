module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error', 'Please log in first');
      res.redirect('/auth/login');
    },
    
    ensureAdmin: (req, res, next) => {
      if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
      }
      req.flash('error', 'Access denied. Admin privileges required.');
      res.redirect('/');
    }
  };