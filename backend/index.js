require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.static("public"));

// we will work with json
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// using verify token as a middleware here
app.use(require("./controllers/LoginController").verifyToken);
app.use(require("./routes/Login"));
app.use(require("./routes/Answers"));
app.use(require("./routes/Forms"));
app.use(require("./routes/Questions"));
app.use(require("./routes/Sessions"));

const port = 8080;

app.get("/api", (req, res) => {
  res.redirect("/api.html");
});

app.get("/uml", (req, res) => {
  res.redirect("/uml.png");
});

app.get("/", (req, res) => {
  res.redirect("/test.html");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = app;
