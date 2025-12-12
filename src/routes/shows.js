const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /shows  - list all shows
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, start_time, total_seats FROM shows ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching shows', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /admin/create  - create a new show
// body: { name, start_time, total_seats }
router.post('/create', async (req, res) => {
  try {
    const { name, start_time, total_seats } = req.body;
    if (!name || !start_time || !total_seats) {
      return res.status(400).json({ error: 'name, start_time and total_seats are required' });
    }
    const insert = `INSERT INTO shows (name, start_time, total_seats) VALUES ($1, $2, $3) RETURNING id, name, start_time, total_seats`;
    const values = [name, start_time, total_seats];
    const result = await db.query(insert, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating show', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
