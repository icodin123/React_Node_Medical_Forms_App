const express = require("express");
const multer = require("multer");
const FormController = require("../controllers/FormController");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/form", (req, res) => {
  FormController.getFormIds(req, res);
});

router.get("/form/:id", (req, res) => {
  FormController.getFormById(req, res);
});

router.post("/form", upload.single("xmlfile"), (req, res) => {
  FormController.postForm(req, res);
});

module.exports = router;
