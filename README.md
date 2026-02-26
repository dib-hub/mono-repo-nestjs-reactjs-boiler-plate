# Monorepo Template

A modern full-stack NX monorepo featuring:

- **Backend**: NestJS API with PostgreSQL
- **Frontend**: React with Tailwind CSS
- **Database**: Prisma ORM with PostgreSQL
- **Shared**: TypeScript types library

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+ (recommended) or npm
- Docker & Docker Compose (for local PostgreSQL)

### 1. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your local values
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

Verify the database is running:

```bash
docker-compose ps
```

### 4. Initialize Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Seed the database
pnpm db:seed
```

### 5. Start Development Servers

```bash
# Start both API and web simultaneously
pnpm dev

# Or start individually:
# Terminal 1: Start API
pnpm nx serve api

# Terminal 2: Start Web
pnpm nx serve web
```

Open:

- **API**: http://localhost:3000/api
- **Web**: http://localhost:4200

## 📂 Project Structure

```
monorepo-template/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   └── app/
│   │   │       ├── app.module.ts
│   │   │       ├── app.controller.ts
│   │   │       └── app.service.ts
│   │   └── package.json
│   │
│   ├── web/                 # React + Tailwind frontend
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── app/
│   │   │   │   └── App.tsx
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── styles/
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── api-e2e/             # API end-to-end tests (Jest)
│   ├── web-e2e/             # Web end-to-end tests (Playwright)
│   │
│   └── README.md
│
├── libs/
│   ├── repository/           # Prisma database lib
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── database.module.ts
│   │   │   ├── lib/prisma.service.ts
│   │   │   └── index.ts
│   │   └── README.md
│   │
│   └── types/               # Shared TypeScript types
│       ├── src/
│       │   ├── dtos/
│       │   ├── entities/
│       │   ├── enums/
│       │   ├── interfaces/
│       │   ├── utils/
│       │   └── index.ts
│       └── README.md
│
├── .env.example             # Environment template
├── docker-compose.yml       # PostgreSQL setup
├── nx.json                  # NX configuration
├── tsconfig.base.json       # Root TypeScript config
├── package.json             # Root dependencies
└── README.md               # This file
```

## 🔨 Common Commands

### Development

```bash
# Start both apps
pnpm dev

# Start only API
pnpm nx serve api

# Start only web
pnpm nx serve web

# Watch TypeScript compilation
pnpm nx run api:build --watch
```

### Building

```bash
# Build all projects
pnpm build

# Build specific project
pnpm nx build api
pnpm nx build web
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific project
pnpm nx test api
pnpm nx test web
pnpm nx test database
pnpm nx test types

# Test with coverage
pnpm nx test api --coverage
```

### Linting

```bash
# Lint all projects
pnpm lint

# Lint specific project
pnpm nx lint api
pnpm nx lint web
```

### Database Management

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Create and apply migrations
pnpm db:migrate

# Deploy migrations (production)
pnpm db:deploy

# Open Prisma Studio (visual DB editor)
pnpm db:studio

# Seed the database
pnpm db:seed

# Reset database (dev only!)
pnpm db:reset
```

### NX Graph

```bash
# Visualize project dependencies
pnpm graph
```

## 🏗️ Architecture

### Module Boundaries

Projects are organized with scope tags to enforce clean dependencies:

| Scope          | Projects                      | Can Depend On               |
| -------------- | ----------------------------- | --------------------------- |
| `scope:api`    | `apps/api`                    | `scope:api`, `scope:shared` |
| `scope:web`    | `apps/web`                    | `scope:web`, `scope:shared` |
| `scope:shared` | `libs/database`, `libs/types` | `scope:shared` only         |

### Type Safety

All projects use shared types from `@my-monorepo/types`:

```typescript
import {
  UserRole,
  UserResponseDto,
  PaginatedResponse,
  ApiResponse,
  JwtPayload,
} from '@my-monorepo/types';
```

### Database Access

The `@my-monorepo/database` library exports `PrismaService` for database operations:

```typescript
import { DatabaseModule, PrismaService } from '@my-monorepo/database';

@Module({
  imports: [DatabaseModule],
})
export class MyModule {
  constructor(private prisma: PrismaService) {}
}
```

## 🔐 Environment Variables

See `.env.example` for all required variables:

| Variable         | Description                  | Example                                                   |
| ---------------- | ---------------------------- | --------------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/myapp_dev` |
| `PORT`           | API server port              | `3000`                                                    |
| `NODE_ENV`       | Environment                  | `development`                                             |
| `CORS_ORIGIN`    | Frontend URL for CORS        | `http://localhost:4200`                                   |
| `JWT_SECRET`     | Secret for JWT signing       | `your-secret-key`                                         |
| `JWT_EXPIRES_IN` | JWT expiry duration          | `7d`                                                      |

## 📝 Adding Features

### Add a NestJS API Resource

```bash
nx g @nx/nest:resource --project=api --name=users --directory=app/modules/users
```

This generates:

- Controller with CRUD routes
- Service with business logic
- Module definition
- DTOs for request/response

### Add a React Component

```bash
nx g @nx/react:component --project=web --name=UserCard --directory=components
```

### Add a Shared Type

1. Create in `libs/types/src/dtos/` or `entities/`
2. Export from `libs/types/src/index.ts`
3. Import from `@my-monorepo/types` anywhere

### Add a Database Model

1. Add model to `libs/repository/prisma/schema.prisma`
2. Run `pnpm db:migrate --name "feature"`
3. Use in API via `@my-monorepo/database`

## 🧪 Testing

### Unit Tests (Jest)

```bash
pnpm test api
pnpm test web
pnpm test database
pnpm test types
```

### E2E Tests

API (Jest):

```bash
pnpm nx test api-e2e
```

Web (Playwright):

```bash
pnpm nx e2e web-e2e --watch
```

## 🐳 Docker

### Run with Docker Compose

Start PostgreSQL:

```bash
docker-compose up -d
```

Stop containers:

```bash
docker-compose down
```

Stop and remove data:

```bash
docker-compose down -v
```

## 📦 Deployment

### Build for Production

```bash
pnpm build
```

Artifacts:

- API: `dist/apps/api`
- Web: `dist/apps/web`

### Database Migrations

Before deploying, always run:

```bash
pnpm db:deploy
```

## 🤝 Contributing

### Code Style

```bash
# Format code
pnpm format

# Auto-fix linting issues
pnpm nx lint --fix
```

### Commit Messages

Use conventional commits:

```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
```

## 📚 Project Documentation

- **API**: See [apps/api/README.md](apps/api/README.md)
- **Web**: See [apps/web/README.md](apps/web/README.md)
- **Database**: See [libs/repository/README.md](libs/repository/README.md)
- **Types**: See [libs/types/README.md](libs/types/README.md)

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Check database is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Reset database (CAUTION: deletes all data)
pnpm db:reset
```

### Port Conflicts

Change in `.env`:

- API_PORT: 3000
- WEB_PORT: 4200

### Dependencies Not Installed

```bash
# Clean installs
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

```bash
# Rebuild dependencies
pnpm nx run database:prisma-generate

# Clear cache
pnpm nx reset
```

## 📖 Resources

- [NX Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📄 License

MIT
