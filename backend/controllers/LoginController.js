const jwt = require("jsonwebtoken");
const {
  addUser,
  getPasswordByUsername,
  checkUserExists,
} = require("../model/User");
const bcrypt = require("bcrypt");
const key = "fellowDevs";

const expirationTime = 3600;

// login functionality
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: "missing data",
    });
  }

  // retrieve password hash from the database by username
  getPasswordByUsername(username)
    .then(results => {
      bcrypt.compare(password, results[0].password, (err, result) => {
        console.log("err", err);
        console.log("result", result);
        if (result) {
          console.log("valid login credentials");

          const specs = { expiresIn: expirationTime };
          const token = jwt.sign({ username }, key, specs);

          res.json({
            success: true,
            message: "logged in",
            token,
          });
          console.log("logged in");
        } else {
          console.log("invalid login credentials");

          res.status(403).json({
            success: false,
            message: "username or password is invalid",
          });
        }
      });
    })
    .catch(error => {
      console.log("Error", error);

      res.status(403).json({
        success: false,
        message: "username or password is invalid",
      });
    });
};

// signup functionality
const signup = (req, res) => {
  const { username, password } = req.body;

  checkUserExists(username)
    .then(exists => {
      console.log(exists);
      if (!exists) {
        bcrypt.genSalt(5, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            addUser(username, hash)
              .then(result => {
                console.log(result);
                console.log("User account was successfully created");
                res.json({
                  success: true,
                  message: "account created",
                });
              })
              .catch(error => {
                console.log("Error", error);

                res.status(500).send({
                  success: false,
                  message: "could not create account",
                });
              });
          });
        });
      } else {
        res.status(400).send({
          success: false,
          message: "provided username is in-use",
        });
      }
    })
    .catch(error => {
      console.log("Error", error);

      res.status(400).send({
        success: false,
        message: "provided username is in-use",
      });
    });
};

// check whether token is valid
const verifyToken = (req, res, next) => {
  if (req.originalUrl === "/login" || req.originalUrl === "/register") {
    return next();
  }

  const token = req.headers["x-access-token"];

  if (token) {
    return jwt.verify(token, key, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "invalid token provided",
        });
      }
      req.decoded = decoded;
      return next();
    });
  }

  return res.json({
    success: false,
    message: "no token provided",
  });
};

module.exports = { login, verifyToken, signup };
