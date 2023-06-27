const { verify } = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");

    if (!token)
      res.status(401).json({
        message: "Token missing",
      });

    const decoded = verify(token, "qwertyuiop");

    req.body.user = decoded;

    next();
  } catch (ex) {
    res.status(400).json({
      message: ex,
    });
  }
};

module.exports = authenticate;
