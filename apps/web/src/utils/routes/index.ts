import { AuthRoute, ProtectedRoute, PublicRoute } from '@my-monorepo/types';

const AUTH_ROUTES: AuthRoute = {
  login: '/signin',
};

const PUBLIC_ROUTES: PublicRoute = {
  home: '/',
  pricing: '/pricing',
  about: '/about',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
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
