const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const PORT = 3000;

// Gunakan body-parser untuk menangani data dari form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Untuk form HTML

// Sajikan file index.html dari direktori inti (mardiyanaweb)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html')); // Mengarah ke index.html di direktori inti
});

// Route untuk menyajikan halaman register
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'register', 'register.html'));
});

// Route untuk menyajikan halaman login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'login', 'login.html'));
});

// Route untuk register (POST request)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Simpan data user di memori sementara (bisa diubah menjadi database)
  let users = [];

  // Cek apakah username sudah ada
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username sudah digunakan!' });
  }

  // Hash password sebelum menyimpan
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'Registrasi berhasil!' });
});

// Route untuk login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Simpan data user di memori sementara (bisa diubah menjadi database)
  let users = [];

  // Cari user di array
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).json({ message: 'Username atau password salah!' });
  }

  // Bandingkan password yang di-hash
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (isPasswordMatch) {
    // Jika login berhasil, redirect ke halaman seller
    res.redirect('/seller');
  } else {
    res.status(400).json({ message: 'Username atau password salah!' });
  }
});

// Route untuk halaman seller
app.get('/seller', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'seller', 'seller.html'));
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
