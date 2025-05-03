
const jwt = require('jsonwebtoken');

module.exports = (allowedRoles) => {
  return (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Set user id in req.user
      req.user = decoded;

      // Check if role is allowed
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
    function ensureAuth(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/login');
  }
  
  };
};
