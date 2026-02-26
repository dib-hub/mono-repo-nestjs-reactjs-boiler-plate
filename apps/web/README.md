# Web

React + Tailwind CSS frontend application.

## Getting Started

### Start the development server

```bash
nx serve web
```

The application will run on `http://localhost:4200`.

### Build for production

```bash
nx build web
```

## Running tests

```bash
nx test web
```

## Project Structure

```
src/
├── main.tsx              # Entry point
├── app/
│   └── App.tsx          # Root component with routing
├── pages/                # Page components
│   └── HomePage.tsx     # Home page
├── components/           # Reusable UI components
│   └── Layout.tsx       # Layout wrapper
├── assets/               # Images, fonts, etc.
└── styles/               # Global CSS + Tailwind
    └── globals.css      # Global styles
```

## Configuration

### Tailwind CSS

Tailwind CSS is configured in `tailwind.config.js`. Customize colors, fonts, and other design tokens there.

### Vite

Build and dev server configuration is in `vite.config.ts`. The app includes a proxy for `/api` routes to the backend server.

## Dependencies

- React 18
- React Router for routing
- Tailwind CSS for styling
- Vite for bundling
- Shared types library for type safety

## Environment Variables

Create a `.env.local` file with:

```
VITE_API_URL=http://localhost:3000/api
```

This will be used to configure API calls to the backend.
