// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// router.post("/register", (req, res) => {
//   const { name, email, password, role } = req.body;

//   const sql = "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)";

//   db.query(sql, [name, email, password, role], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "User registered" });
//   });
// });

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const sql = "SELECT * FROM users WHERE email=? AND password=?";

//   db.query(sql, [email, password], (err, result) => {
//     if (err) return res.status(500).json(err);

//     if (result.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json(result[0]);
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;