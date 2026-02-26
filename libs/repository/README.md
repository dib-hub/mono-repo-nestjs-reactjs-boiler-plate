# Repository Library

Prisma database client, services, and database module for the monorepo.

## Getting Started

This library encapsulates all database operations and exports a `PrismaService` that can be injected into NestJS modules.

## Structure

```
src/
├── database.module.ts      # NestJS module that exports PrismaService
├── lib/
│   └── prisma.service.ts   # Injectable service for database access
├── index.ts                # Main export
prisma/
├── schema.prisma           # Prisma schema definition
└── seed.ts                 # Database seeding script
```

## Prisma Commands

```bash
# Generate Prisma client after schema changes
nx run database:prisma-generate

# Create a new migration (in development)
nx run database:prisma-migrate-dev

# Deploy migrations (in production)
nx run database:prisma-migrate-deploy

# Open Prisma Studio to view/edit data
nx run database:prisma-studio

# Seed the database
nx run database:prisma-seed

# Reset the database (development only)
nx run database:prisma-reset
```

## Using the Database in NestJS

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule, PrismaService } from '@my-monorepo/database';

@Module({
  imports: [DatabaseModule],
})
export class MyModule {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
```

## Schema Management

Edit `prisma/schema.prisma` to:

- Add/modify models
- Configure relationships
- Set field constraints

After changes:

```bash
# Create a migration
nx run database:prisma-migrate-dev --name "feature description"

# Apply migrations
nx run database:prisma-migrate-deploy
```

## Environment Variables

Required in `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

## Testing

```bash
nx test database
```

## Module Boundaries

- `scope:shared` - Can only depend on other `scope:shared` libraries
- Used by both `apps/api` and `apps/web` (though typically only API uses it)

## Best Practices

- Don't expose raw Prisma client directly from services
- Create service methods for common queries
- Use transactions for multi-step operations
- Always handle connection errors gracefully
