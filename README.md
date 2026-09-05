# DevFlow

DevFlow is a multi-tenant project management application with organizations, projects, Kanban boards, tasks, comments, and an activity feed.

## 🚀 Live Deployment

- **Frontend:** https://devflow-brown.vercel.app
- **Backend:** Azure App Service (F1)
- **Database:** Neon PostgreSQL

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Axios, and Lucide React
- **Backend:** Node.js, Express 5, TypeScript, Zod, JWT, bcrypt, and Swagger UI
- **Database:** Neon PostgreSQL (PostgreSQL 16 compatible)
- **Deployment:** Vercel (Frontend), Azure App Service F1 (Backend), and Neon PostgreSQL (Database)

## Project Structure

```text
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       └── types/
├── docker-compose.yml
└── README.md
```

## Features

- User registration and login with JWT authentication
- Organizations with owners and members
- Projects and multiple boards per project
- Kanban tasks with `TODO`, `IN_PROGRESS`, and `DONE` statuses
- Optional task assignees and task comments
- Activity logs for organization, project, board, task, and comment changes
- Swagger API documentation at `/docs`
- Protected frontend routes and persisted authentication state
- Organization-scoped authorization for projects, boards, tasks, and comments
- Validated resource IDs and request bodies with consistent API errors

## Requirements

- Node.js 22 or later
- npm
- PostgreSQL 16 or Docker Desktop

## Local Development

### 1. Start PostgreSQL

Use a local PostgreSQL database, or start only the database container:

```bash
docker compose up -d postgres
```

The Compose database uses:

```text
DATABASE_URL=postgresql://devflow:devflowpassword@localhost:5432/devflow?schema=public
```

### 2. Configure and start the backend

Create `backend/.env` with a database URL and a strong JWT secret. The repository includes `backend/.env.example` as a starting point:

```env
DATABASE_URL="postgresql://devflow:devflowpassword@localhost:5432/devflow?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3000
```

Then install dependencies, generate Prisma Client, apply the checked-in migrations, and start the API:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The API runs at `http://localhost:3000`. The health endpoint is `http://localhost:3000/health`, and Swagger UI is available at `http://localhost:3000/docs`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. It uses `http://localhost:3000` by default for API requests. To use another API URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Docker Compose

The Compose file starts PostgreSQL, the backend, and the production frontend container:

```bash
docker compose up --build -d
```

The services are available at:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`
- PostgreSQL: `localhost:5432`

The backend image does not run migrations during startup. For a new database, apply the migrations from the host after PostgreSQL is running, before using the application:

```bash
cd backend
$env:DATABASE_URL="postgresql://devflow:devflowpassword@localhost:5432/devflow?schema=public"
npx prisma migrate deploy
```

On macOS or Linux, use `export DATABASE_URL="..."` instead of the PowerShell environment-variable command.

Stop the stack with:

```bash
docker compose down
```

To also remove the persisted database volume, run `docker compose down -v`.

The Docker database uses the credentials defined in the root `docker-compose.yml`; this root file is the supported full-stack setup.

## API Overview

Protected endpoints require `Authorization: Bearer <jwt-token>`.

| Area | Endpoints |
|------|-----------|
| Health | `GET /`, `GET /health` |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `GET /auth/users` |
| Organizations | `GET\|POST /organizations`, `GET /organizations/:organizationId`, `GET /organizations/:organizationId/members`, `POST /organizations/:organizationId/members` |
| Projects | `GET\|POST /organizations/:organizationId/projects`, `GET /projects/:projectId` |
| Boards | `GET\|POST /projects/:projectId/boards`, `GET /boards/:boardId` |
| Tasks | `GET\|POST /boards/:boardId/tasks`, `GET /tasks/:taskId`, `PATCH\|DELETE /boards/:boardId/tasks/:taskId` |
| Comments | `GET\|POST /tasks/:taskId/comments` |
| Activity | `GET /activities` |

The complete request and response definitions are available in Swagger UI.

All resource lookups are scoped to the authenticated user's organization membership. Organization member invitations are restricted to organization owners, and task assignees must belong to the same organization.

## Verification

Run the backend build:

```bash
cd backend
npm run build
```

Run the frontend lint and production build:

```bash
cd frontend
npm run lint
npm run build
```