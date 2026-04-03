import { AuthRoute, ProtectedRoute, PublicRoute } from '@src/interfaces/routes';

const AUTH_ROUTES: AuthRoute = {
  login: '/signin',
};

const PUBLIC_ROUTES: PublicRoute = {
  home: '/',
};

const PROTECTED_ROUTES_NAMES: ProtectedRoute = {
  dashboard: '/dashboard',
  profile: '/profile',
};

export const ROUTES = {
  AUTH_ROUTES,
  PROTECTED_ROUTES_NAMES,
  PUBLIC_ROUTES,
};
