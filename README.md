Nice — I’ll pick the next single, high-impact task for you: **create a clear README for the backend repo**, commit it, and push it to GitHub. That gives the assessors (and you later) a single place with setup, run, and test instructions — super useful for the placement assignment.

Below is a small, copy-pasteable PowerShell block that:

1. creates a helpful `README.md` in your backend repo (`D:\Programs\modex-backend`),
2. stages and commits it,
3. pushes it to `origin main`.

Paste the whole block into PowerShell and run it from anywhere — it will `cd` into the backend folder for you.

````powershell
cd D:\Programs\modex-backend

# safety: show folder
Write-Host "Writing README in: " (Get-Location)

# Write README content (overwrite if exists)
@"
# Modex Backend

This repository contains the **Modex** backend (Express + Postgres) for the Modex seat-booking assignment.

## Quick overview
- Node.js + Express server (API endpoints under `/shows`, `/book`, `/admin`)
- PostgreSQL database `modex_booking`
- Transaction-safe booking endpoint to prevent double-booking

## Local setup (Windows)

1. Install Node.js (v18+ recommended) and npm.
2. Install PostgreSQL (create a `postgres` superuser and remember its password).

3. Create database and run schema:
```powershell
# create DB (adjust password if prompted)
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE modex_booking;"
# apply schema (adjust file path if needed)
psql -U postgres -h localhost -p 5432 -d modex_booking -f "D:\Programs\modex-backend\sql\schema.sql"
````

4. Create .env in repository root:

```
PORT=4000
DATABASE_URL=postgresql://postgres:1234@localhost:5432/modex_booking
NODE_ENV=development
```

(Change `1234` to the postgres password you set.)

5. Install dependencies and start server:

```powershell
cd D:\Programs\modex-backend
npm install
npm run dev   # starts with nodemon -> server listens on PORT
```

## API quick tests (PowerShell)

Create a demo show:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:4000/admin/show -ContentType "application/json" -Body ('{"name":"Demo Movie","start_time":"2025-12-20T18:00:00Z","total_seats":100}')
```

List seats for show 1:

```powershell
Invoke-RestMethod -Uri http://localhost:4000/shows/1/seats -Method Get
```

Book seats (transactional):

```powershell
$body = @{ show_id = 1; seat_numbers = @("S01","S02"); customer_name = "Arpan" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:4000/book -ContentType "application/json" -Body $body
```

## Notes

* If `psql` is not on your PATH, use full path to `psql.exe` (e.g. `C:\Program Files\PostgreSQL\15\bin\psql.exe`).
* The frontend expects `REACT_APP_API_URL` set to the backend base URL (for local dev use `http://localhost:4000`).

## Troubleshooting

* `Cannot GET /shows/...` — confirm server is running and `.env` `PORT` matches.
* `409 Conflict` on booking — some seats were already booked.
* If you changed schema or filenames, update `sql/schema.sql` path above.

---

Made by: **Arpan D. Frank** — Modex assignment
"@ | Set-Content -Encoding UTF8 README.md -Force

# commit & push

git add README.md
git commit -m "Add README: setup and API instructions" 2>$null
git push origin main

```

When that finishes, tell me:
- “README pushed” (if it worked), or
- paste the error lines if any command failed.

After we finish backend README, next single step I recommend is: **create a README for frontend** (so both repos have docs), or **record a 2–3 minute demo video** showing the app, or **deploy backend to Render/Heroku**. Which one should we do next? (Say `frontend README`, `demo video`, or `deploy backend`.)
::contentReference[oaicite:0]{index=0}
```
