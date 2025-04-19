const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all items
app.get('/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM items ORDER BY category, name');
  res.json(result.rows);
});

// Add a new item
app.post('/items', async (req, res) => {
  const { name, quantity, image, category } = req.body;
  await pool.query(
    'INSERT INTO items (name, quantity, image, category) VALUES ($1, $2, $3, $4)',
    [name, quantity, image, category]
  );
  res.sendStatus(201);
});

// Optional: list categories
app.get('/categories', async (req, res) => {
  const result = await pool.query('SELECT DISTINCT category FROM items ORDER BY category');
  res.json(result.rows.map(r => r.category));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
