// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, role, phone, specialization, age, gender, bloodGroup } = req.body;

  try {
    // 1. Check if user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert into users table
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'patient']
    );
    const userId = result.insertId;

    // 4. Insert into role-specific table
    if (role === 'doctor') {
      const docSql = "INSERT INTO doctors (user_id, specialization, phone, status) VALUES (?, ?, ?, ?)";
      await pool.query(docSql, [userId, specialization || 'General', phone || '', 'active']);
    } else if (role === 'patient' || !role) {
      const patSql = "INSERT INTO patients (user_id, age, gender, phone, blood_group, status) VALUES (?, ?, ?, ?, ?, ?)";
      await pool.query(patSql, [userId, age || 0, gender || 'male', phone || '', bloodGroup || 'O+', 'active']);
    }

    // 5. Create token
    const token = jwt.sign(
      { id: userId, role: role || 'patient' },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role: role || 'patient' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };