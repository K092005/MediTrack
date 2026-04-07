// routes/files.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const upload = require("../middleware/upload");

// ─────────────────────────────────────────────
//  Patient uploads their own medical history
// ─────────────────────────────────────────────
router.post("/upload-medical-history", upload.single("file"), async (req, res) => {
  try {
    const { patient_user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    if (!patient_user_id) {
      return res.status(400).json({ success: false, message: "patient_user_id is required" });
    }

    const sql = `
      INSERT INTO medical_records (patient_user_id, file_name, file_path, uploaded_by)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [
      patient_user_id,
      req.file.originalname,
      req.file.filename,   // stored filename on disk (not original name)
      patient_user_id,
    ]);

    res.json({ success: true, message: "Medical history uploaded successfully", fileName: req.file.filename });
  } catch (err) {
    console.error("upload-medical-history error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  Doctor uploads a prescription for a patient
// ─────────────────────────────────────────────
router.post("/upload-prescription", upload.single("file"), async (req, res) => {
  try {
    const { doctor_user_id, patient_user_id, diagnosis, appointment_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    if (!doctor_user_id || !patient_user_id) {
      return res.status(400).json({ success: false, message: "doctor_user_id and patient_user_id are required" });
    }

    const sql = `
      INSERT INTO prescription_files
        (doctor_user_id, patient_user_id, file_name, file_path, diagnosis, appointment_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [
      doctor_user_id,
      patient_user_id,
      req.file.originalname,
      req.file.filename,
      diagnosis || "General Prescription",
      appointment_id || null,
    ]);

    res.json({ success: true, message: "Prescription uploaded successfully", fileName: req.file.filename });
  } catch (err) {
    console.error("upload-prescription error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  Get medical history files for a patient
// ─────────────────────────────────────────────
router.get("/medical-history/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const [rows] = await db.query(
      `SELECT m.*, u.name AS uploader_name
       FROM medical_records m
       JOIN users u ON m.uploaded_by = u.user_id
       WHERE m.patient_user_id = ?
       ORDER BY m.created_at DESC`,
      [userID]
    );

    res.json(rows);
  } catch (err) {
    console.error("get medical-history error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  Get all prescription files (with optional filters)
// ─────────────────────────────────────────────
router.get("/prescriptions", async (req, res) => {
  try {
    const { patient_user_id, doctor_user_id } = req.query;

    let sql = `
      SELECT
        pf.*,
        du.name AS doctor_name,
        pu.name AS patient_name
      FROM prescription_files pf
      JOIN users du ON pf.doctor_user_id = du.user_id
      JOIN users pu ON pf.patient_user_id = pu.user_id
      WHERE 1=1
    `;
    const params = [];

    if (patient_user_id) {
      sql += " AND pf.patient_user_id = ?";
      params.push(patient_user_id);
    }
    if (doctor_user_id) {
      sql += " AND pf.doctor_user_id = ?";
      params.push(doctor_user_id);
    }

    sql += " ORDER BY pf.created_at DESC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("get prescriptions error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
