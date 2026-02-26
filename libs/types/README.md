# Types Library

Shared TypeScript types, interfaces, DTOs, and enums for the entire monorepo.

## Getting Started

This library is used across both frontend and backend applications to ensure type safety.

## Structure

```
src/
├── entities/     # Domain entity interfaces (framework-agnostic)
├── dtos/         # Data Transfer Objects (for API contracts)
├── interfaces/   # Generic interfaces (API responses, pagination, etc.)
├── enums/        # Shared enums
├── utils/        # Utility types
└── index.ts      # Main export file
```

## Importing Types

From anywhere in the monorepo:

```typescript
import { UserRole, UserResponseDto, PaginatedResponse } from '@my-monorepo/types';
```

## Running Tests

```bash
nx test types
```

## Module Boundaries

- `scope:shared` - Can only depend on other `scope:shared` libraries
- This library is used by both `scope:api` and `scope:web`

## Best Practices

- Keep types framework-agnostic (no NestJS or React specific types)
- Use clear, descriptive names
- Document complex types with JSDoc comments
- Keep DTOs organized by feature/domain
