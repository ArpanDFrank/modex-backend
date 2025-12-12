require('dotenv').config();
const express = require('express');
const cors = require('cors');
const showsRouter = require('./routes/shows');
const bookingsRouter = require('./routes/bookings');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/shows', showsRouter);
app.use('/admin', showsRouter); // leave admin create endpoint under /admin/create
app.use('/', bookingsRouter);   // booking endpoints: GET /shows/:id/seats and POST /book

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
