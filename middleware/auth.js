const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };
      next();
    } catch (e) {
      res.status(401).json({
        success: false,
        message: e.message,
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route.',
    });
  }
};

exports.optionalProtected = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  } else {
    req.user = null;
    next();
  }
};
