const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');


// Configurazione del database
const db = mysql.createPool({
  host: 'localhost', // o il tuo host MySQL
  user: 'jaita',
  password: 'jaita107',
  database: 'javeat'
});

// Inizializza l'app Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Endpoint per ottenere tutti gli utenti
app.get('/users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint per aggiungere un nuovo utente
app.post('/users', (req, res) => {
  const { mail, password, phone, position_x, position_y } = req.body;
  db.query('INSERT INTO user (mail, password, phone, position_x, position_y) VALUES (?, ?, ?, ?, ?)',
    [mail, password, phone, position_x, position_y], (err, results) => {
      if (err) throw err;
      res.json({ id: results.insertId, ...req.body });
  });
});

// Avvia il server
const PORT = 3500;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
