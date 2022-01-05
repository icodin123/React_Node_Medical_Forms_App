const pool = require("../db/db");

const addUser = (username, password) => {
  const query = "INSERT INTO users VALUES($1, $2)";
  const values = [username, password];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, res) => {
      if (err) {
        reject(err.stack);
      } else {
        resolve("Success");
      }
    });
  });
};

const updateUserCredentials = (
  oldUsername,
  oldPassword,
  newUsername,
  newPassword
) => {
  const query =
    "Update users set username=$1, password=$2, WHERE username=$3 AND password=$4";
  const values = [newUsername, newPassword, oldUsername, oldPassword];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, res) => {
      if (err) {
        reject(err.stack);
      } else {
        resolve("Success");
      }
    });
  });
};

const deleteUser = (username, password) => {
  const query = "DELETE FROM users WHERE username=$1 AND password=$2";
  const values = [username, password];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, res) => {
      if (err) {
        reject(err.stack);
      } else {
        resolve("Success");
      }
    });
  });
};

const getPasswordByUsername = username => {
  const query = "SELECT password FROM users where username=$1";
  const values = [username];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, res) => {
      if (err) {
        reject(err.stack);
      } else {
        resolve(res.rows);
      }
    });
  });
};

const checkUserExists = username => {
  const query = "SELECT * FROM users where username=$1";
  const values = [username];
  console.log(query);

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, res) => {
      if (err) {
        console.log(err.stack);
        reject(err.stack);
      } else {
        console.log(res);
        resolve(res.rows.length != 0);
      }
    });
  });
};

exports.addUser = addUser;
exports.updateUserCredentials = updateUserCredentials;
exports.deleteUser = deleteUser;
exports.getPasswordByUsername = getPasswordByUsername;
exports.checkUserExists = checkUserExists;
