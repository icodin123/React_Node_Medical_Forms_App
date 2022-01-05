const questions = {
  basr: {
    question: "Patients name",
    question_type: "tb",
    parent_question: null,
    child_questions: ["hpqu", "qwer"],
  },
  hpqu: {
    question: "Patients DOB",
    question_type: "tb",
    parent_question: "basr",
    child_questions: [],
  },
  qwer: {
    question: "Patient age",
    question_type: "mc",
    possible_answers: ["0-19", "20-39", "40-59", "60-99"],
    parent_question: "basr",
    child_questions: ["asdf"],
  },
  asdf: {
    question: "Patient characteristics",
    question_type: "cb",
    possible_answers: ["Short", "Tall", "Angry", "Sad", "Bald", "Long hair"],
    parent_question: "qwer",
    child_questions: [],
  },
};

exports.mockQuestions = questions;
