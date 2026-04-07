// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "isha1108",
//   database: "meditrack"
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("Connected to MySQL Database");
//   }
// });

// module.exports = db;

// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');   // Changed to promise version (better for async/await)

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'meditrack',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection when file is loaded
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connected Successfully!');
    console.log(`   Database: ${process.env.DB_NAME || 'meditrack'}`);
    connection.release();
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error.message);
    console.error('Please check your .env file (DB_PASSWORD, DB_NAME, etc.)');
  }
}

testConnection();

module.exports = pool;