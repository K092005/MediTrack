const express = require("express");
const router = express.Router();
const db = require("../db");
const upload = require("../middleware/upload");

router.post("/upload", upload.single("file"), (req, res) => {

  const { appointment_id, notes } = req.body;
  const file = req.file.buffer;

  const sql = `
  INSERT INTO prescriptions (appointment_id,file,notes)
  VALUES (?,?,?)
  `;

  db.query(sql, [appointment_id, file, notes], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Prescription uploaded" });
  });

});

module.exports = router;