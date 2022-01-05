const { v4: uuidv4 } = require("uuid");
const pool = require("../db/db");

const addSession = (data, callback) => {
  const id = uuidv4();
  const query =
    "INSERT INTO sessions VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING session_id, form_id, user_id, submitted, last_updated";
  const values = [id, data.formId, data.userId, false];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const getSession = (id, callback) => {
  const query = "Select * FROM sessions where session_id=$1";
  const values = [id];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const getAllSessions = callback => {
  const query = "Select * FROM sessions";

  pool.query(query, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const getAllUserSessions = (user_id, callback) => {
  const query = "Select * FROM sessions where user_id=$1";
  const values = [user_id];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const toggleSubmit = (data, callback) => {
  const query = "UPDATE sessions set submitted=$1 where session_id=$2";
  const values = [true, data.session_id];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const updateSession = (data, callback) => {
  const query =
    "UPDATE sessions set last_updated=CURRENT_TIMESTAMP where session_id=$1";
  const values = [data.session_id];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

exports.addSession = addSession;
exports.getSession = getSession;
exports.getAllSessions = getAllSessions;
exports.getAllUserSessions = getAllUserSessions;
exports.updateSession = updateSession;
exports.toggleSubmit = toggleSubmit;
