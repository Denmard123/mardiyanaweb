const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware untuk meng-handle JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk meng-handle file statis (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../'))); // Ini akan memungkinkan file HTML diakses dari direktori root

// Lokasi file untuk menyimpan data pengguna
const USERS_FILE = path.join(__dirname, 'users.json');

// Fungsi untuk membaca data pengguna dari file
function readUsers() {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
  }
  return [];
}

// Fungsi untuk menyimpan data pengguna ke file
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Endpoint untuk registrasi dengan metode POST
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }

  // Baca data pengguna yang sudah ada
  let users = readUsers();

  // Cek apakah email sudah terdaftar
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah digunakan!' });
  }

  // Tambahkan pengguna baru
  users.push({ username, password });
  saveUsers(users);

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

  // Baca data pengguna yang tersimpan
  let users = readUsers();

  // Cek apakah email dan password cocok
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.json({ message: 'Login berhasil!' });
  } else {
    res.status(401).json({ message: 'Email atau password salah!' });
  }
});

// Jalankan server di port yang ditentukan
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
