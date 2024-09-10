const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Gunakan body-parser untuk menangani data dari form
app.use(bodyParser.json());

// Simpan data user di memori sementara (harusnya di database)
let users = [];

// Route untuk register
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Cek apakah username sudah ada
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username sudah digunakan!' });
  }

  // Simpan user baru
  users.push({ username, password });
  res.status(201).json({ message: 'Registrasi berhasil!' });
});

// Route untuk login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Cari user di database (memori sementara)
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login berhasil!' });
  } else {
    res.status(400).json({ message: 'Username atau password salah!' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
