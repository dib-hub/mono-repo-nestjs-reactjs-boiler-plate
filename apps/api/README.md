# API

NestJS backend application for the monorepo.

## Getting Started

### Start the development server

```bash
nx serve api
```

The API will run on `http://localhost:3000/api`.

### Build for production

```bash
nx build api
```

## Running tests

```bash
nx test api
```

## Project Structure

```
src/
├── main.ts              # Entry point
└── app/
    ├── app.module.ts    # Root module
    ├── app.controller.ts # Root controller
    └── app.service.ts    # Root service
```

## Adding New Features

To generate a new NestJS resource:

```bash
nx g @nx/nest:resource --project=api --name=users --directory=app/modules/users
```

This will create:

- `users.controller.ts` - HTTP routes
- `users.service.ts` - Business logic
- `users.module.ts` - Module definition
- `users.entity.ts` - Database entity
- `dtos/` - Request/Response DTOs

## Dependencies

- NestJS framework
- PostgreSQL + Prisma ORM (via `@my-monorepo/database`)
- Shared types (via `@my-monorepo/types`)
