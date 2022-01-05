const { v4: uuidv4 } = require("uuid");
const pool = require("../db/db");

const addForm = (form, name, callback) => {
  const id = uuidv4();

  const text = "INSERT INTO forms VALUES($1, $2, $3) RETURNING id, name, form";
  const values = [id, name, form];

  pool.query(text, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows[0]);
    }
  });
};

const getFormIds = callback => {
  const text = "SELECT id, name FROM forms";

  pool.query(text, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

const getFormById = (id, callback) => {
  const query = "SELECT form, name FROM forms where id=$1";
  const values = [id];

  pool.query(query, values, (err, res) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, res.rows);
    }
  });
};

exports.addForm = addForm;
exports.getFormIds = getFormIds;
exports.getFormById = getFormById;
