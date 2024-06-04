const jwt = require("jsonwebtoken");
const secrete = process.env.JWT_SUPER_SEACRETE || "superGupthKey";
const requireAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader
    ? authHeader.split(" ")[1]
    : req.cookies.access_token || null;
  if (token) {
    jwt.verify(token, secrete, (err, decoadedToken) => {
      if (err) {
        return res.status(401).json({ message: err.message, status: "Error" });
      } else {
        res.locals.tokenData = decoadedToken;
        next();
      }
    });
  } else {
    res.status(401).json({
      message: "token not found",
      status: "Error",
    });
  }
};
module.exports = { requireAuth };
