# Testing guide

The project uses Jest for backend unit tests and Jest + Supertest for backend
integration tests.

## Commands

Run from `backend`:

```powershell
npm.cmd test
npm.cmd run test:unit
npm.cmd run test:integration
```

## Structure

- `backend/src/__tests__/unit`: DTO and repository tests.
- `backend/src/__tests__/integration`: Supertest endpoint, middleware,
  authentication, authorization, validation, error, and edge-case tests.
