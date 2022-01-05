const express = require("express");
const AnswerController = require("../controllers/AnswerController");

const router = express.Router();

router.post("/answer", (req, res) => {
  AnswerController.postAnswer(req, res);
});

router.post("/answers", (req, res) => {
  AnswerController.postAnswers(req, res);
});

router.get("/answer/:id", (req, res) => {
  AnswerController.getAnswer(req, res);
});

router.get("/answers/:sessionid", (req, res) => {
  AnswerController.getAnswers(req, res);
});

module.exports = router;
