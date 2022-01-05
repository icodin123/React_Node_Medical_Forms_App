const express = require("express");
const SessionController = require("../controllers/SessionController");

const router = express.Router();

router.post("/session", (req, res) => {
  SessionController.postSession(req, res);
});

router.get("/session/:id", (req, res) => {
  SessionController.getSession(req, res);
});

router.get("/sessions", (req, res) => {
  SessionController.getAllSessions(req, res);
});

router.get("/sessions/:userid", (req, res) => {
  SessionController.getAllUserSessions(req, res);
});

router.post("/update-session", (req, res) => {
  SessionController.updateSession(req, res);
});

router.post("/toggle-submit-session", (req, res) => {
  SessionController.toggleSubmit(req, res);
});

module.exports = router;
