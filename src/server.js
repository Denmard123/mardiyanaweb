const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('./db'); // Import koneksi database

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'Den-mardiyana-saputra';

// Middleware untuk meng-handle JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk meng-handle file statis (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../')));

// Endpoint untuk registrasi dengan metode POST
app.post('/register', [
  body('username').isEmail().withMessage('Email harus valid').notEmpty().withMessage('Email wajib diisi'),
  body('password').isLength({ min: 6 }).withMessage('Password harus memiliki setidaknya 6 karakter').notEmpty().withMessage('Password wajib diisi')
], async (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    // Cek apakah email sudah ada di database
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        return next(err); // Operasikan error ke middleware
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email sudah terdaftar!' });
      }

      // Hash password sebelum menyimpan ke database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        // Tambahkan pengguna baru ke database
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
          if (err) {
            return next(err);
          }
          res.json({ message: 'Registrasi berhasil!' });
        });
      });
    });
  } catch (error) {
    next(error); // Operasikan error ke middleware
  }
});

// Endpoint untuk login
app.post('/login', [
  body('username').isEmail().withMessage('Email harus valid').notEmpty().withMessage('Email wajib diisi'),
  body('password').isLength({ min: 6 }).withMessage('Password harus memiliki setidaknya 6 karakter').notEmpty().withMessage('Password wajib diisi')
], (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    // Cek apakah username dan password cocok di database
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Email tidak terdaftar!' });
      }

      const user = results[0];

      // Bandingkan password dengan hash di database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return next(err);
        }

        if (isMatch) {
          const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
          res.json({ message: 'Login berhasil!', token });
        } else {
          res.status(401).json({ message: 'Password salah!' });
        }
      });
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint untuk reset password
app.post('/reset-password', [
  body('email').isEmail().withMessage('Email harus valid').notEmpty().withMessage('Email wajib diisi'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password harus memiliki setidaknya 6 karakter').notEmpty().withMessage('Password baru wajib diisi')
], (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, newPassword } = req.body;

    // Cek apakah email terdaftar di database
    db.query('SELECT * FROM users WHERE username = ?', [email], (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Email tidak terdaftar!' });
      }

      // Hash password baru sebelum menyimpan ke database
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        // Update password di database
        db.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, email], (err) => {
          if (err) {
            return next(err);
          }
          res.json({ message: 'Password berhasil di-reset!' });
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

// Middleware untuk menangani semua error yang tidak tertangani
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.' });
});

// Jalankan server di port yang ditentukan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
