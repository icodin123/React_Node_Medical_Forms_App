const express = require("express");
const LoginController = require("../controllers/LoginController");

const router = express.Router();

router.get("/verify", LoginController.verifyToken);

router.post("/login", LoginController.login);

router.post("/register", LoginController.signup);

router.get("/verify", LoginController.verifyToken);

module.exports = router;
