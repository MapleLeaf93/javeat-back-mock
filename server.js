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

// Endpoint per ottenere tutti i ristoranti
app.get('/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurant', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint per ottenere un ristorante specifico per ID
app.get('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;
  db.query('SELECT * FROM restaurant WHERE id = ?', [restaurantId], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Ristorante non trovato' });
    }
  });
});

// Endpoint per aggiungere un nuovo ristorante
app.post('/restaurants', (req, res) => {
  const { name, phone, opening_hour, closing_hour, position_x, position_y, delivery_price_per_unit, max_delivery_distance, img_url } = req.body;
  db.query(
    'INSERT INTO restaurant (name, phone, opening_hour, closing_hour, position_x, position_y, delivery_price_per_unit, max_delivery_distance, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, phone, opening_hour, closing_hour, position_x, position_y, delivery_price_per_unit, max_delivery_distance, img_url],
    (err, results) => {
      if (err) throw err;
      res.json({ id: results.insertId, ...req.body });
    }
  );
});

// Endpoint per aggiornare un ristorante esistente
app.put('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;
  const { name, phone, opening_hour, closing_hour, position_x, position_y, delivery_price_per_unit, max_delivery_distance, img_url } = req.body;
  db.query(
    'UPDATE restaurant SET name=?, phone=?, opening_hour=?, closing_hour=?, position_x=?, position_y=?, delivery_price_per_unit=?, max_delivery_distance=?, img_url=? WHERE id=?',
    [name, phone, opening_hour, closing_hour, position_x, position_y, delivery_price_per_unit, max_delivery_distance, img_url, restaurantId],
    (err, results) => {
      if (err) throw err;
      if (results.affectedRows > 0) {
        res.json({ id: restaurantId, ...req.body });
      } else {
        res.status(404).json({ error: 'Ristorante non trovato' });
      }
    }
  );
});

// Endpoint per eliminare un ristorante
app.delete('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;
  db.query('DELETE FROM restaurant WHERE id = ?', [restaurantId], (err, results) => {
    if (err) throw err;
    if (results.affectedRows > 0) {
      res.json({ message: 'Ristorante eliminato con successo' });
    } else {
      res.status(404).json({ error: 'Ristorante non trovato' });
    }
  });
});

// Avvia il server
const PORT = 3500;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
