-- shows table
CREATE TABLE IF NOT EXISTS shows (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  total_seats INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- seats table
CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  show_id INTEGER NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  booking_id INTEGER NULL,
  UNIQUE(show_id, seat_number)
);

-- bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  show_id INTEGER NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  seats jsonb NOT NULL,
  customer_name TEXT,
  created_at TIMESTAMP DEFAULT now()
);
