const express = require('express');
const router = express.Router();
const db = require('../db');

// ─────────────────────────────────────────────
//  GET /api/patients
//  Get all patients
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        patients.*, 
        users.name, 
        users.email 
      FROM patients
      JOIN users ON patients.user_id = users.user_id
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /patients error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  POST /api/patients/add
//  Admin adds a new patient record (DEPRECATED - use auth/register)
// ─────────────────────────────────────────────
router.post('/add', async (req, res) => {
  try {
    const { user_id, age, gender, phone, bloodGroup } = req.body;
    const sql = "INSERT INTO patients (user_id, age, gender, phone, blood_group, status) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(sql, [user_id, age || 0, gender || 'male', phone || '', bloodGroup || 'O+', 'active']);
    res.json({ success: true, message: "Patient record created successfully" });
  } catch (err) {
    console.error('POST /patients/add error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/patients/:user_id
//  Update patient and user tables
// ─────────────────────────────────────────────
router.put('/:user_id', async (req, res) => {
  try {
    let { user_id } = req.params;

    // Normalize ID: handle "pat-1" or "1"
    const cleanId = user_id.includes("-") ? user_id.split("-")[1] : user_id;

    // Destructure with fallbacks to avoid ReferenceErrors
    const { 
      name, 
      email, 
      age = 0, 
      gender = 'male', 
      phone = '', 
      bloodGroup = 'O+', 
      status = 'active', 
      assignedDoctorId = null 
    } = req.body;

    console.log(`Updating Patient ID: ${cleanId}`, { age, gender, phone, status });

    // 1. Update name and email in users table
    if (name || email) {
      const userSql = "UPDATE users SET name = ?, email = ? WHERE user_id = ?";
      await db.query(userSql, [name, email, cleanId]);
    }

    // 2. Update patient specific fields in patients table
    // Note: ensure we mapping bloodGroup (came from frontend) to blood_group (DB column)
    const patientSql = `
      UPDATE patients 
      SET age = ?, gender = ?, phone = ?, blood_group = ?, status = ?, assigned_doctor_id = ?
      WHERE user_id = ?
    `;
    await db.query(patientSql, [
      age, 
      gender, 
      phone, 
      bloodGroup, 
      status, 
      assignedDoctorId ? (assignedDoctorId.includes("-") ? assignedDoctorId.split("-")[1] : assignedDoctorId) : null,
      cleanId
    ]);

    res.json({ success: true, message: "Patient updated successfully" });
  } catch (err) {
    console.error('PUT /patients error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;