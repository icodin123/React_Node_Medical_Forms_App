const { v4: uuidv4 } = require("uuid");
const pool = require("../db/db");

const addAnswer = (data, callback) => {
  const id = uuidv4();

  const query =
    "INSERT INTO answers VALUES($1, $2, $3, $4, $5, $6) RETURNING id, form_id, question_id, user_id, session_id, answer";
  const values = [
    id,
    data.formId,
    data.questionId,
    data.userId,
    data.sessionId,
    data.answer,
  ];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows[0]);
    }
  });
};

const getAnswer = (id, callback) => {
  const query = "Select * FROM answers where id=$1";
  const values = [id];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const getAnswers = (sessionId, callback) => {
  const query = "Select * FROM answers where session_id=$1";
  const values = [sessionId];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const addAnswers = (data, callback) => {
  var formattedData = formatMultipleRowData(data);
  pool.query(
    `INSERT INTO answers VALUES ${expand(
      formattedData.length,
      formattedData[0].length
    )}`,
    flatten(formattedData),
    (err, res) => {
      if (err) {
        callback(err.stack);
      } else {
        callback(null, res.rows);
      }
    }
  );
};

function formatMultipleRowData(data) {
  var newArr = [];
  data.forEach(answer =>
    newArr.push([
      uuidv4(),
      answer.formId,
      answer.questionId,
      answer.userId,
      answer.sessionId,
      answer.answer,
    ])
  );
  return newArr;
}

function expand(rowCount, columnCount, startAt = 1) {
  var index = startAt;
  return Array(rowCount)
    .fill(0)
    .map(
      v => `(${Array(columnCount).fill(0).map(v => `$${index++}`).join(", ")})`
    )
    .join(", ");
}

function flatten(arr) {
  var newArr = [];
  arr.forEach(v => v.forEach(p => newArr.push(p)));
  return newArr;
}

exports.addAnswer = addAnswer;
exports.addAnswers = addAnswers;
exports.getAnswer = getAnswer;
exports.getAnswers = getAnswers;
