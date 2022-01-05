const { execSync } = require("child_process");
const { unlinkSync } = require("fs");
const Form = require("../model/Form");

const parseXml = filePath => {
  let data = execSync(`python3 ./convert.py ${filePath}`);
  data = data.toString("utf8");
  data = data.replace(/[A-Za-z]'[A-Za-z]/g, "");
  data = data.replace(/'/g, '"');
  data = data.replace(/ None,/g, ' "",');

  return data;
};

const deleteFile = filePath => {
  try {
    unlinkSync(filePath);
    // file removed
  } catch (err) {
    console.error(err);
  }
};

const getFormIds = (req, res) => {
  Form.getFormIds((err, rows) => {
    if (err) {
      return res.status(400).send({ success: false, message: err });
    }

    return res.status(200).send({ success: true, forms: rows });
  });
};

const getFormById = (req, res) => {
  Form.getFormById(req.params.id, (err, rows) => {
    if (err) {
      return res.status(400).send({ success: false, message: err });
    }

    // console.log(rows);
    if (rows.length === 0) {
      return res.status(200).send({ success: true, forms: rows });
    }

    const formString = rows[0].form;
    const formJSON = JSON.parse(formString);
    return res
      .status(200)
      .send({ success: true, forms: [{ form: formJSON, name: rows[0].name }] });
  });
};

const postForm = (req, res) => {
  const formName = req.body.name;
  const uploadedFile = req.file;
  const uploadedFilePath = `./${uploadedFile.path}`;

  let formData = parseXml(uploadedFilePath);
  formData = JSON.parse(formData);

  deleteFile(uploadedFilePath);

  Form.addForm(formData, formName, (err, newRow) => {
    if (err) {
      return res.status(400).send({ success: false, message: err });
    }

    return res.status(201).send({ success: true, form: newRow });
  });
};

exports.getFormIds = getFormIds;
exports.postForm = postForm;
exports.getFormById = getFormById;
