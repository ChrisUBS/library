# Library Manager

A full-stack library management project with:

- A Spring Boot API backed by MariaDB
- An Angular frontend for book CRUD operations
- Database migrations managed with Flyway

## Project Structure

- `api/` - Spring Boot backend
- `frontend/` - Angular frontend
- `scripts/dev.mjs` - Cross-platform launcher for local development
- `package.json` - Root-level development commands

## Requirements

- Node.js 20+ for the development launcher and Angular frontend
- Java 25 for the Spring Boot API
- MariaDB running locally

## Environment Files

The backend reads its configuration from `api/.env`.

The frontend environment files live in:

- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.development.ts`
- `frontend/src/environments/environment.production.ts`

## Development Commands

From the repository root:

```bash
npm run dev:api
npm run dev:frontend
npm run dev:all
```

You can also use the generic form:

```bash
npm run dev -- api
npm run dev -- frontend
npm run dev -- all
```

### What Each Command Does

- `npm run dev:api` starts only the Spring Boot API
- `npm run dev:frontend` starts only the Angular frontend
- `npm run dev:all` starts both services in parallel

The launcher automatically:

- loads `api/.env` when starting the API
- uses the right executable on Windows, macOS, and Linux
- shuts down both processes cleanly when you press `Ctrl+C`

## Running the Services Manually

If you prefer to start each app by hand:

### API

```bash
cd api
set -a
source .env
set +a
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Database Migrations

Flyway runs automatically when the API starts.

Migration scripts live in:

- `api/src/main/resources/db/migration`

The current migration creates the `books` table.

## API Ports

- API: `http://localhost:8080`
- Frontend: `http://localhost:4200`

## Notes

- The frontend is built as a CRUD UI for books
- The API exposes the book endpoints used by the frontend
- If you change the `.env` values, restart the API so the new settings are picked up

