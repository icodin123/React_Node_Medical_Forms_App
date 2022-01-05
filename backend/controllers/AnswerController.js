const Answer = require("../model/Answer");
const postAnswer = (req, res) => {
  Answer.addAnswer(req.body, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

const getAnswer = (req, res) => {
  Answer.getAnswer(req.params.id, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

const postAnswers = (req, res) => {
  Answer.addAnswers(req.body, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

const getAnswers = (req, res) => {
  Answer.getAnswers(req.params.sessionid, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

exports.postAnswer = postAnswer;
exports.postAnswers = postAnswers;
exports.getAnswer = getAnswer;
exports.getAnswers = getAnswers;
