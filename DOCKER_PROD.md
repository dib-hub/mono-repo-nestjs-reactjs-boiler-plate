# Production Docker

## How it works

`pnpm run docker:prod` runs `docker-compose -f docker-compose.prod.yml up -d --build`,
which builds and starts 3 containers on a shared `myapp_network`:

| Container | Image | Port | Role |
| --- | --- | --- | --- |
| `myapp_postgres_prod` | postgres:16-alpine | internal only | Database with persistent volume |
| `myapp_backend_prod` | Dockerfile.backend | 3000 | NestJS API — runs migrations then starts |
| `myapp_frontend_prod` | Dockerfile.frontend | 80 | React app served by Nginx, proxies `/api` to backend |

**Startup order:** postgres (healthy) → backend (healthy) → frontend

### What each build does

**Backend** (`Dockerfile.backend`):

1. Installs all deps with pnpm `--shamefully-hoist`
2. Generates Prisma client
3. Builds NestJS with webpack (bundles app + workspace libs into `dist/main.js`)
4. Prunes devDependencies
5. Runtime: runs `prisma migrate deploy` then `node dist/main.js`

**Frontend** (`Dockerfile.frontend`):

1. Installs all deps with pnpm `--shamefully-hoist`
2. Builds React with Vite (`apps/web/dist/`)
3. Copies built assets into nginx:alpine image

---

## Environment Variables

Create a `.env` file in the project root before running:

```env
# Database
DB_USER=postgres
DB_PASSWORD=change-me-strong-password
DB_NAME=myapp_prod

# Auth
JWT_SECRET=change-me-random-64-char-secret

# CORS — set to your production domain
CORS_ORIGIN=http://localhost
```

The `DATABASE_URL` is constructed automatically inside `docker-compose.prod.yml`:

```bash
postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5434/${DB_NAME}
```

> **Required in production:** `DB_PASSWORD` and `JWT_SECRET` must be changed
> from defaults.

---

## Commands

```bash
# Build images and start all containers
pnpm run docker:prod

# Stream logs from all containers
pnpm run docker:prod:logs

# Stop and remove containers (data volume preserved)
pnpm run docker:prod:down

# Stop and remove containers + database volume (data loss!)
docker-compose -f docker-compose.prod.yml down -v

# View logs for a specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

---

## Accessing the app

| Endpoint | URL |
| --- | --- |
| Frontend | <http://localhost> |
| API | <http://localhost/api> or <http://localhost:3000/api> |
| Swagger | <http://localhost:3000/api/docs> |

---

## Relevant files

| File | Purpose |
| --- | --- |
| `docker-compose.prod.yml` | Service orchestration |
| `Dockerfile.backend` | Backend multi-stage build |
| `Dockerfile.frontend` | Frontend multi-stage build |
| `nginx.conf` | Nginx config (static files + `/api` proxy) |
| `libs/repository/prisma.config.ts` | Prisma datasource URL config (read at runtime) |
| `.env` | Environment variables (create from `.env.example`) |
