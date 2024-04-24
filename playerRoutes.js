const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const app = express();

// SWAGGER
const swaggerUi = require('swagger-ui-express');
const apiDocumentation = require('./apidocs.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'footballdb',
  password: 'RHSmau123',
  port: 5432, // Port PostgreSQL Anda
});

// CREATE
router.post('/', async (req, res) => {
  const { name, club, position, age } = req.body;
  try {
    const newPlayer = await pool.query('INSERT INTO football_players (name, club, position, age) VALUES ($1, $2, $3, $4) RETURNING *', [name, club, position, age]);
    res.json(newPlayer.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// READ
router.get('/', async (req, res) => {
  try {
    const players = await pool.query('SELECT * FROM football_players');
    res.json(players.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET player by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const player = await pool.query('SELECT * FROM football_players WHERE id = $1', [id]);
    if (player.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, club, position, age } = req.body;
  try {
    const updatedPlayer = await pool.query('UPDATE football_players SET name = $1, club = $2, position = $3, age = $4 WHERE id = $5 RETURNING *', [name, club, position, age, id]);
    res.json(updatedPlayer.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM football_players WHERE id = $1', [id]);
    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
