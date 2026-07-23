# Yeti Trek

Yeti Trek is a Nepal trekking companion web application for discovering
trails, comparing stays, sharing trek moments and blogs, and managing
bookings. The project contains a Next.js frontend and an Express/MongoDB API.

## Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Express 5, TypeScript, MongoDB with Mongoose
- Testing: Playwright E2E, Jest unit tests, and Jest/Supertest integration tests

## Project structure

```text
backend/        Express API, database models, and Jest tests
frontend/       Next.js application and Playwright E2E tests
```

## Prerequisites

- Node.js and npm
- MongoDB running locally, or a MongoDB connection URL

## Installation

Install dependencies in both applications:

```powershell
cd backend
npm.cmd install

cd ..\frontend
npm.cmd install
```

Install Chromium for the Playwright E2E tests:

```powershell
npx.cmd playwright install chromium
```

## Environment variables

Create `backend/.env` when you need values different from the local defaults:

```dotenv
PORT=4000
MONGODB_URL=mongodb://localhost:27017/Nepal-Trekking-Companion-db
SECRET_KEY=replace-with-a-secure-secret
CLIENT_URL=http://localhost:3000
EMAIL_USER=
EMAIL_PASS=
GEMINI_API_KEY=
```

Optionally create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

Do not commit real secrets or environment files.

## Running the application

Start the backend in one terminal:

```powershell
cd backend
npm.cmd run dev
```

Start the frontend in another terminal:

```powershell
cd frontend
npm.cmd run dev
```

Open `http://localhost:3000`. The API runs at `http://localhost:4000` by
default.

## Testing

Run backend tests from `backend`:

```powershell
npm.cmd test
npm.cmd run test:unit
npm.cmd run test:integration
```

Run the 25 Playwright E2E tests from `frontend`:

```powershell
npm.cmd run test:e2e
```

Useful Playwright modes:

```powershell
npm.cmd run test:e2e:headed
npm.cmd run test:e2e:ui
npm.cmd run test:e2e:report
```

Playwright starts the frontend development server automatically. Some pages
load API data, so run the backend and MongoDB when testing data-dependent
features.

## Build and lint

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build

cd ..\backend
npm.cmd run build
```
