-- ============================================================
-- MediTrack Database Migration
-- Run this in MySQL Workbench or via: mysql -u root -p meditrack < migrate.sql
-- ============================================================

USE meditrack;

-- ── 1. Add missing columns to appointments ──────────────────
ALTER TABLE appointments
  ADD COLUMN type  VARCHAR(255) DEFAULT 'General Consultation',
  ADD COLUMN notes TEXT;

-- Normalize status to lowercase (old data may have 'Scheduled')
UPDATE appointments SET status = LOWER(status);

-- ── 2. medical_records table ────────────────────────────────
-- Stores patient-uploaded medical history documents
CREATE TABLE IF NOT EXISTS medical_records (
  record_id       INT AUTO_INCREMENT PRIMARY KEY,
  patient_user_id INT          NOT NULL,
  file_name       VARCHAR(255) NOT NULL,
  file_path       VARCHAR(500) NOT NULL,
  uploaded_by     INT          NOT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_user_id) REFERENCES users(user_id),
  FOREIGN KEY (uploaded_by)     REFERENCES users(user_id)
);

-- ── 3. prescription_files table ─────────────────────────────
-- Stores doctor-uploaded prescriptions for patients
CREATE TABLE IF NOT EXISTS prescription_files (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  doctor_user_id  INT          NOT NULL,
  patient_user_id INT          NOT NULL,
  file_name       VARCHAR(255) NOT NULL,
  file_path       VARCHAR(500) NOT NULL,
  diagnosis       VARCHAR(255) DEFAULT 'General Prescription',
  appointment_id  INT          DEFAULT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_user_id)  REFERENCES users(user_id),
  FOREIGN KEY (patient_user_id) REFERENCES users(user_id)
);

-- ── 4. Verify your users have correct roles ──────────────────
-- Run this SELECT to check:
-- SELECT user_id, name, email, role FROM users;

-- If any doctor user has NULL/wrong role, fix with:
-- UPDATE users SET role = 'doctor'  WHERE email = 'doctor@example.com';
-- UPDATE users SET role = 'patient' WHERE email = 'patient@example.com';
-- UPDATE users SET role = 'admin'   WHERE email = 'admin@example.com';

-- ── 5. Ensure doctors/patients rows exist for those users ────
-- Every user with role='doctor'  must have a row in doctors  table (with user_id)
-- Every user with role='patient' must have a row in patients table (with user_id)
-- Example:
-- INSERT INTO doctors  (user_id, specialization) VALUES (<doctor_user_id>,  'General Medicine');
-- INSERT INTO patients (user_id) VALUES (<patient_user_id>);

SELECT 'Migration complete ✅' AS status;
