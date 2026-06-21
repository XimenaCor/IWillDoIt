# IWillDoIt

A task marketplace API that connects people who need help with everyday tasks to people willing to do them — whether for pay or simply out of goodwill.

Users post tasks with a location and an optional price (tasks can be paid or altruistic). Other users submit offers to take them on. A task stays open and visible until the owner explicitly accepts an offer, at which point it's assigned.

Live at: **https://iwilldoit.fly.dev/tasks**

## Tech stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Database | PostgreSQL (Fly.io managed) |
| ORM | Prisma |
| Runtime | Node.js |
| Containerization | Docker (multi-stage build) |
| Deployment | Fly.io (London region) |
| CI/CD | GitHub Actions |

## Architecture

The application runs as a stateless NestJS API backed by a managed PostgreSQL instance. Configuration is fully externalized via environment variables, and the same Docker image is used in both local development and production — no environment-specific builds.

Multi-stage Docker build keeps the production image minimal: the build stage compiles the NestJS app and generates the Prisma client, and the production stage runs only what's needed.

Database migrations run automatically on deploy via `prisma migrate deploy`, so schema and application are always in sync.

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/user` | Create a user |
| POST | `/location/:userId` | Add a location for a user |
| POST | `/tasks` | Post a new task |
| POST | `/offers` | Submit an offer on a task |
| GET | `/tasks` | List all tasks |
| GET | `/offers` | List all offers |
| GET | `/user` | List all users |

## Getting started

```bash
# Clone the repo and install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

For production deployment via Fly.io:

```bash
fly launch
fly deploy
```

## Project structure

```
src/
├── user/        # user module
├── location/    # location module
├── tasks/       # task module
├── offers/      # offers module
└── main.ts      # entry point
prisma/
├── schema.prisma
└── migrations/
```
