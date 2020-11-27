const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "Waseem Munir Secret Diary", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ Message: "Token is invalid" });
      } else {
        req.user = decodedToken;
        console.log("Token Verified");
        return next();
      }
    });
  } else {
    res.status(401).json({ Message: "No Token,Authorication Denied" });
  }
};

module.exports = { checkUser };
