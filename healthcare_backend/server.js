// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve uploaded files statically ─────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Import Routes ─────────────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth');
const doctorRoutes       = require('./routes/doctors');
const patientRoutes      = require('./routes/patients');
const appointmentRoutes  = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const filesRoutes        = require('./routes/files');

// ── Use Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/doctors',      doctorRoutes);
app.use('/api/patients',     patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions',prescriptionRoutes);
app.use('/api/files',        filesRoutes);

// ── Health-check Routes ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '✅ Healthcare Backend Server is Running!',
    database: process.env.DB_NAME || 'meditrack',
    environment: process.env.NODE_ENV
  });
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ status: '✅ Database connection successful', result: rows });
  } catch (error) {
    res.status(500).json({ status: '❌ Database connection failed', error: error.message });
  }
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});