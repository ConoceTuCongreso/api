const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = sessionChecker;
