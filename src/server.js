const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'Den-mardiyana-saputra';

// Path untuk file penyimpanan pengguna
const usersFilePath = path.join(__dirname, 'users.json');

app.use(cors({
  origin: 'https://mardiyanaweb.vercel.app', // Izinkan hanya dari domain ini
  methods: ['GET', 'POST'],
  credentials: true,
}));
// Middleware untuk meng-handle JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk meng-handle file statis (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../')));

// Fungsi untuk membaca data pengguna dari file
const readUsersFromFile = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Fungsi untuk menyimpan data pengguna ke file
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users file:', error);
  }
};

// Endpoint untuk registrasi dengan metode POST
app.post('/register', [
  body('username').isEmail().withMessage('Email harus valid').notEmpty().withMessage('Email wajib diisi'),
  body('password').isLength({ min: 6 }).withMessage('Password harus memiliki setidaknya 6 karakter').notEmpty().withMessage('Password wajib diisi')
], async (req, res) => {
  // Validasi input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password } = req.body;
  const users = readUsersFromFile();

  // Cek apakah email sudah ada
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah terdaftar!' });
  }

  // Hash password sebelum menyimpan
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Simpan pengguna baru
  users.push({ username, password: hashedPassword });
  writeUsersToFile(users);
  res.json({ message: 'Registrasi berhasil!' });
});

// Endpoint untuk login
app.post('/login', [
  body('username').isEmail().withMessage('Email harus valid').notEmpty().withMessage('Email wajib diisi'),
  body('password').isLength({ min: 6 }).withMessage('Password harus memiliki setidaknya 6 karakter').notEmpty().withMessage('Password wajib diisi')
], (req, res) => {
  // Validasi input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password } = req.body;
  const users = readUsersFromFile();

  // Cek apakah username dan password cocok
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Email tidak terdaftar!' });
  }

  // Bandingkan password dengan hash
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    if (isMatch) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login berhasil!', token });
    } else {
      res.status(401).json({ message: 'Password salah!' });
    }
  });
});

// Endpoint untuk reset password
app.post('/reset-password', [
  body('email').isEmail().withMessage('Email harus valid').notEmpty().withMessage('Email wajib diisi'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password harus memiliki setidaknya 6 karakter').notEmpty().withMessage('Password baru wajib diisi')
], (req, res) => {
  // Validasi input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, newPassword } = req.body;
  const users = readUsersFromFile();

  // Cek apakah email terdaftar
  const user = users.find(user => user.username === email);
  if (!user) {
    return res.status(404).json({ message: 'Email tidak terdaftar!' });
  }

  // Hash password baru
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan.' });
    }

    // Update password
    user.password = hashedPassword;
    writeUsersToFile(users);
    res.json({ message: 'Password berhasil di-reset!' });
  });
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
