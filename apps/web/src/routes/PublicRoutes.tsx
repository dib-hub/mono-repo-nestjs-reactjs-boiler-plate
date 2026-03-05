import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '../utils/routes';
import SignIn from '../pages/SignIn';
import HomePage from '../pages/HomePage';

const PublicRoutes: React.FC = () => (
  <Routes>
    <Route path={ROUTES.PUBLIC_ROUTES.home} element={<HomePage />} />
    <Route path={ROUTES.AUTH_ROUTES.login} element={<SignIn />} />
    <Route path={'*'} element={<Navigate to={ROUTES.AUTH_ROUTES.login} replace />} />
  </Routes>
);

export default React.memo(PublicRoutes);
