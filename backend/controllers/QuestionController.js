const { mockQuestions } = require("./MockControllerData");

const getQuestion = (req, res) => {
  const { questionId } = req.params;

  // Check for errors
  if (mockQuestions[questionId] === undefined) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid questionId provided." });
  }

  // Return response if question id is valid
  return res
    .status(200)
    .send({ success: true, data: mockQuestions[questionId] });
};

exports.getQuestion = getQuestion;
