const express = require("express");
const QuestionController = require("../controllers/QuestionController");

const router = express.Router();

router.get("/questions/:questionId", (req, res) => {
  QuestionController.getQuestion(req, res);
});

module.exports = router;
