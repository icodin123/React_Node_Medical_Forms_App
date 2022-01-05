const Session = require("../model/Session");
const postSession = (req, res) => {
  Session.addSession(req.body, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.status(201).send({ success: true, result: newRow });
  });
};

const getSession = (req, res) => {
  Session.getSession(req.params.id, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

const getAllSessions = (req, res) => {
  Session.getAllSessions((err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

const getAllUserSessions = (req, res) => {
  Session.getAllUserSessions(req.params.userid, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

const updateSession = (req, res) => {
  Session.updateSession(req.body, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

const toggleSubmit = (req, res) => {
  Session.toggleSubmit(req.body, (err, newRow) => {
    if (err) {
      return res.send({ success: false, message: err });
    }

    return res.send({ success: true, result: newRow });
  });
};

exports.postSession = postSession;
exports.getSession = getSession;
exports.getAllSessions = getAllSessions;
exports.getAllUserSessions = getAllUserSessions;
exports.updateSession = updateSession;
exports.toggleSubmit = toggleSubmit;
