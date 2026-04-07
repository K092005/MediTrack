const express = require("express");
const router = express.Router();
const db = require("../db");

// ─────────────────────────────────────────────
//  GET /api/doctors
//  Get all doctors with patient count
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT 
        doctors.*, 
        users.name, 
        users.email,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = doctors.doctor_id) as patients_count
      FROM doctors
      JOIN users ON doctors.user_id = users.user_id
      WHERE users.role = 'doctor'
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("GET /doctors error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  POST /api/doctors/add
//  Admin adds a new doctor (DEPRECATED - use auth/register)
// ─────────────────────────────────────────────
router.post("/add", async (req, res) => {
  try {
    const { user_id, specialization } = req.body;
    const sql = "INSERT INTO doctors (user_id, specialization, status, phone) VALUES (?, ?, ?, ?)";
    await db.query(sql, [user_id, specialization || "General", "active", ""]);
    res.json({ success: true, message: "Doctor record created" });
  } catch (err) {
    console.error("POST /doctors/add error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/doctors/:user_id
//  Update doctor and user tables
// ─────────────────────────────────────────────
router.put("/:user_id", async (req, res) => {
  try {
    let { user_id } = req.params;

    // Normalize ID: handle "doc-1" or "1"
    const cleanId = user_id.includes("-") ? user_id.split("-")[1] : user_id;

    // Destructure with fallbacks to prevent ReferenceErrors
    const {
      name,
      email,
      specialization = "General",
      experience = 0,
      status = "active",
      phone = ""
    } = req.body;

    console.log(`Updating Doctor ID: ${cleanId}`, { specialization, status, phone });

    // 1. Update name and email in users table
    if (name || email) {
      const userSql = "UPDATE users SET name = ?, email = ? WHERE user_id = ?";
      await db.query(userSql, [name, email, cleanId]);
    }

    // 2. Update doctor specific fields in doctors table
    const doctorSql = `
      UPDATE doctors 
      SET specialization = ?, experience = ?, status = ?, phone = ?
      WHERE user_id = ?
    `;
    await db.query(doctorSql, [specialization, experience, status, phone, cleanId]);

    res.json({ success: true, message: "Doctor updated successfully" });
  } catch (err) {
    console.error("PUT /doctors error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;