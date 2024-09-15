const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware untuk meng-handle JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk meng-handle file statis (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../'))); // Ini akan memungkinkan file HTML diakses dari direktori root

// Penyimpanan data pengguna di memori
let users = [];

// Endpoint untuk registrasi dengan metode POST
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }

  // Cek apakah email sudah terdaftar
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah ada!' });
  }

  // Tambahkan pengguna baru ke penyimpanan memori
  users.push({ username, password });

  // Kirim respon sukses sebagai JSON
  return res.json({ message: 'Registrasi berhasil!' });
});

// Endpoint untuk login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }

  // Cek apakah email dan password cocok
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.json({ message: 'Login berhasil!' });
  } else {
    res.status(401).json({ message: 'Email tidak terdaftar atau password salah!' });
  }
});

// Endpoint untuk reset password
app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  // Validasi input
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email dan password baru wajib diisi!' });
  }

  // Cek apakah email terdaftar
  const user = users.find(user => user.username === email);
  if (!user) {
    return res.status(404).json({ message: 'Email tidak terdaftar!' });
  }

  // Update password pengguna
  user.password = newPassword;
  res.json({ message: 'Password berhasil di-reset!' });
});


// Jalankan server di port yang ditentukan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
