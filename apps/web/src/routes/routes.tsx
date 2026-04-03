import { lazy } from 'react';
import { ROUTES } from '@src/utils/routes';
const Dashboard = lazy(() => import('@src/pages/Dashboard'));
const ProfilePage = lazy(() => import('@src/pages/Profile'));

export const PROTECTED_ROUTES = [
  {
    id: 1,
    path: ROUTES.PROTECTED_ROUTES_NAMES.dashboard,
    element: <Dashboard />,
  },
  {
    id: 2,
    path: ROUTES.PROTECTED_ROUTES_NAMES.profile,
    element: <ProfilePage />,
  },
];
