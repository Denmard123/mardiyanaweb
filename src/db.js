const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // ganti dengan user MySQL kamu
  password: 'Persij@1', // ganti dengan password MySQL kamu
  database: 'mardiyanaweb' // ganti dengan nama database yang sesuai
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID', connection.threadId);
});

module.exports = connection;
