# Setup Guide

A step-by-step guide to get the monorepo running on your machine.

## System Requirements

- **Node.js**: 20.0.0 or higher
- **pnpm**: 8.0.0 or higher (or npm 10+)
- **Docker**: For local PostgreSQL database
- **Git**: For version control

## Installation Steps

### 1. Clone or Extract the Repository

```bash
cd monorepo-template
```

### 2. Install Node Modules

```bash
# Recommended: Using pnpm
pnpm install

# Or using npm
npm install
```

This installs all dependencies defined in the root `package.json`. Dependencies are shared across all applications and libraries in the monorepo.

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and adjust values for your local setup:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp_dev?schema=public
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
JWT_SECRET=dev-only-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 4. Start PostgreSQL Database

```bash
docker-compose up -d
```

Verify it's running:

```bash
docker-compose ps
```

You should see the `postgres` container in the "Up" state.

### 5. Initialize the Database

#### Generate Prisma Client

```bash
pnpm db:generate
```

This generates the Prisma client from the schema defined in `libs/repository/prisma/schema.prisma`.

#### Run Migrations

```bash
pnpm db:migrate
```

This creates database tables based on the Prisma schema. You'll be prompted to name the migration (e.g., "init").

#### (Optional) Seed the Database

```bash
pnpm db:seed
```

This runs the seed script in `libs/repository/prisma/seed.ts` to populate test data.

### 6. Verify Everything Works

Open three terminal windows:

**Terminal 1: Start the API**

```bash
pnpm nx serve api
```

You should see:

```
🚀 Server is running on http://localhost:3000/api
```

Test the API:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "uptime": 0.123
}
```

**Terminal 2: Start the Web App**

```bash
pnpm nx serve web
```

You should see Vite starting on port 4200.

**Terminal 3: Run Tests (Optional)**

```bash
pnpm test
```

### 7. Access the Applications

- **Frontend**: http://localhost:4200
- **API Health**: http://localhost:3000/api/health
- **Prisma Studio** (visual DB tool): `pnpm db:studio`

## Project Structure Walkthrough

```
monorepo-template/
├── apps/
│   ├── api/              # NestJS backend application
│   ├── web/              # React frontend application
│   ├── api-e2e/          # API integration tests
│   └── web-e2e/          # Frontend E2E tests
│
├── libs/
│   ├── repository/       # Prisma database library
│   │   └── prisma/
│   │       ├── schema.prisma    # Database schema
│   │       └── seed.ts          # Sample data
│   │
│   └── types/            # Shared TypeScript types
│       └── src/
│           ├── dtos/             # Data Transfer Objects
│           ├── entities/         # Domain models
│           ├── enums/            # Shared enums
│           └── interfaces/       # API contracts
│
├── .env.example          # Environment variable template
├── docker-compose.yml    # Docker services
├── nx.json              # NX workspace config
├── package.json         # Dependencies
└── README.md            # Main documentation
```

## Useful Commands

### Development

```bash
# Start all apps
pnpm dev

# Start individual apps
pnpm nx serve api
pnpm nx serve web

# View project dependencies
pnpm graph
```

### Database

```bash
# View/edit data visually
pnpm db:studio

# Create a new migration
pnpm db:migrate

# Reset database (WARNING: deletes all data)
pnpm db:reset
```

### Testing & Quality

```bash
# Run all tests
pnpm test

# Run tests for a specific project
pnpm nx test api
pnpm nx test web

# Format code
pnpm format

# Lint code
pnpm lint
```

### Building

```bash
# Build all projects
pnpm build

# Build individual projects
pnpm nx build api
pnpm nx build web
```

## Troubleshooting

### "Cannot find module '@my-monorepo/database'"

Run: `pnpm install`

### "Database connection refused"

Check if PostgreSQL is running:

```bash
docker-compose ps
docker-compose up -d
```

### "Port 3000 or 4200 already in use"

Kill the process using the port or change it in `.env`:

```bash
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### TypeScript errors after pulling

Regenerate Prisma client:

```bash
pnpm db:generate
pnpm nx reset
```

### Permission denied on scripts

```bash
chmod +x scripts/*.sh
```

## Next Steps

### Adding Features

1. **New Backend Endpoint**

   ```bash
   nx g @nx/nest:resource --project=api --name=posts
   ```

2. **New Frontend Component**

   ```bash
   nx g @nx/react:component --project=web --name=PostCard
   ```

3. **New Shared Type**
   - Add to `libs/types/src/`
   - Export from `libs/types/src/index.ts`

### Useful Resources

- **NX Guide**: https://nx.dev/getting-started
- **NestJS Tutorial**: https://docs.nestjs.com
- **React Guide**: https://react.dev/learn
- **Prisma Guide**: https://www.prisma.io/docs/getting-started

## Docker Cheat Sheet

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop services
docker-compose down

# Remove volumes (deletes data)
docker-compose down -v

# Restart services
docker-compose restart
```

## Git Workflow

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

## Production Considerations

Before deploying:

1. Update `.env` with production values
2. Run `pnpm build` to create optimized bundles
3. Run `pnpm db:deploy` to apply database migrations
4. Set `NODE_ENV=production`
5. Use a proper database backup strategy

---

**Questions?** Check the main [README.md](./README.md) or individual project READMEs.
