const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /shows/:id/seats  - list seats for a show
router.get('/shows/:id/seats', async (req, res) => {
  const showId = parseInt(req.params.id, 10);
  if (!showId) return res.status(400).json({ error: 'invalid show id' });

  try {
    const result = await db.query('SELECT id, seat_number, status, booking_id FROM seats WHERE show_id = $1 ORDER BY id', [showId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching seats', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /book
// Body: { show_id: number, seat_numbers: ["S1","S2"], customer_name: "Name" }
router.post('/book', async (req, res) => {
  const { show_id, seat_numbers, customer_name } = req.body;
  if (!show_id || !Array.isArray(seat_numbers) || seat_numbers.length === 0) {
    return res.status(400).json({ error: 'show_id and seat_numbers are required' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const selectForUpdateQuery = `
      SELECT id, seat_number, status
      FROM seats
      WHERE show_id = $1 AND seat_number = ANY($2)
      FOR UPDATE
    `;
    const selectRes = await client.query(selectForUpdateQuery, [show_id, seat_numbers]);

    if (selectRes.rowCount !== seat_numbers.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'One or more seats not found for this show' });
    }

    const alreadyBooked = selectRes.rows.filter(r => r.status !== 'available');
    if (alreadyBooked.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Some seats are already booked', seats: alreadyBooked.map(r => r.seat_number) });
    }

    const bookingRes = await client.query(
      'INSERT INTO bookings (show_id, seats, customer_name) VALUES ($1, $2, $3) RETURNING id, created_at',
      [show_id, JSON.stringify(seat_numbers), customer_name || null]
    );
    const bookingId = bookingRes.rows[0].id;

    await client.query(
      "UPDATE seats SET status = 'booked', booking_id = $1 WHERE show_id = $2 AND seat_number = ANY($3)",
      [bookingId, show_id, seat_numbers]
    );

    await client.query('COMMIT');
    res.status(201).json({ booking_id: bookingId, seats: seat_numbers, created_at: bookingRes.rows[0].created_at });
  } catch (err) {
    await client.query('ROLLBACK').catch(()=>{});
    console.error('Booking error', err);
    res.status(500).json({ error: 'Booking failed' });
  } finally {
    client.release();
  }
});

module.exports = router;
