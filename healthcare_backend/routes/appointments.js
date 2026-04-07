const express = require("express");
const router = express.Router();
const db = require("../db");

// ─────────────────────────────────────────────
//  GET /api/appointments
//  Returns appointments with full user_id-based joins
//  Optional query params: ?user_id=X&role=patient|doctor
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { user_id, role } = req.query;

    let sql = `
      SELECT
        a.appointment_id,
        a.appointment_date AS date,
        a.time_slot,
        a.status,
        a.type,
        a.notes,
        pu.user_id  AS patient_user_id,
        pu.name     AS patient_name,
        du.user_id  AS doctor_user_id,
        du.name     AS doctor_name,
        d.specialization
      FROM appointments a
      JOIN patients p  ON a.patient_id = p.patient_id
      JOIN users   pu  ON p.user_id    = pu.user_id
      JOIN doctors d   ON a.doctor_id  = d.doctor_id
      JOIN users   du  ON d.user_id    = du.user_id
      WHERE 1=1
    `;

    const params = [];

    if (user_id && role === "patient") {
      sql += " AND pu.user_id = ?";
      params.push(user_id);
    } else if (user_id && role === "doctor") {
      sql += " AND du.user_id = ?";
      params.push(user_id);
    }

    sql += " ORDER BY a.appointment_date DESC, a.time_slot ASC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("GET /appointments error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  POST /api/appointments/book
//  Body: { patient_user_id, doctor_user_id, date, time_slot, type }
// ─────────────────────────────────────────────
router.post("/book", async (req, res) => {
  try {
    const { patient_user_id, doctor_user_id, date, time_slot, type } = req.body;

    if (!patient_user_id || !doctor_user_id || !date || !time_slot) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Resolve patient_id from user_id
    const [[patientRow]] = await db.query(
      "SELECT patient_id FROM patients WHERE user_id = ?",
      [patient_user_id]
    );
    if (!patientRow) {
      return res.status(404).json({ success: false, message: "Patient record not found for this user" });
    }

    // Resolve doctor_id from user_id
    const [[doctorRow]] = await db.query(
      "SELECT doctor_id FROM doctors WHERE user_id = ?",
      [doctor_user_id]
    );
    if (!doctorRow) {
      return res.status(404).json({ success: false, message: "Doctor record not found for this user" });
    }

    const [result] = await db.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, time_slot, status, type)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [patientRow.patient_id, doctorRow.doctor_id, date, time_slot, type || "General Consultation"]
    );

    res.json({ success: true, message: "Appointment booked", appointmentId: result.insertId });
  } catch (err) {
    console.error("POST /appointments/book error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  PATCH /api/appointments/:id/status
//  Body: { status: "completed" | "cancelled" | "pending" }
// ─────────────────────────────────────────────
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    await db.query(
      "UPDATE appointments SET status = ? WHERE appointment_id = ?",
      [status, id]
    );

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    console.error("PATCH /appointments/:id/status error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
//  PATCH /api/appointments/:id/notes
//  Body: { notes: "..." }
// ─────────────────────────────────────────────
router.patch("/:id/notes", async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    await db.query(
      "UPDATE appointments SET notes = ? WHERE appointment_id = ?",
      [notes, id]
    );

    res.json({ success: true, message: "Notes saved" });
  } catch (err) {
    console.error("PATCH /appointments/:id/notes error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;