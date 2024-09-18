const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const db = require('./db'); // Import koneksi database

// Middleware untuk meng-handle JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk meng-handle file statis (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../'))); // Ini memungkinkan file HTML diakses dari direktori root

// Endpoint untuk registrasi dengan metode POST
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }

  // Cek apakah email sudah ada di database
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error!' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email sudah ada!' });
    }

    // Tambahkan pengguna baru ke database
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error!' });
      }

      res.json({ message: 'Registrasi berhasil!' });
    });
  });
});

// Endpoint untuk login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }

  // Cek apakah username dan password cocok di database
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error!' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login berhasil!' });
    } else {
      res.status(401).json({ message: 'Email tidak terdaftar atau password salah!' });
    }
  });
});

// Endpoint untuk reset password
app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  // Validasi input
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email dan password baru wajib diisi!' });
  }

  // Cek apakah email terdaftar di database
  db.query('SELECT * FROM users WHERE username = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error!' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Email tidak terdaftar!' });
    }

    // Update password di database
    db.query('UPDATE users SET password = ? WHERE username = ?', [newPassword, email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error!' });
      }

      res.json({ message: 'Password berhasil di-reset!' });
    });
  });
});

// Jalankan server di port yang ditentukan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
