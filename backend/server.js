const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Varun@123", // put your MySQL password here
  database: "login_system",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:");
    console.log(err);
  } else {
    console.log("MySQL database connected");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Register data:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.log("Register DB error:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "User already exists" });
        }

        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ message: "Registration successful" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Login data:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log("Login DB error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});