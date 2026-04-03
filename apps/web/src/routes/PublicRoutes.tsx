import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@src/utils/routes';
import SignIn from '@src/pages/SignIn';
import HomePage from '@src/pages/HomePage';

const PublicRoutes: React.FC = () => (
  <Routes>
    <Route path={ROUTES.PUBLIC_ROUTES.home} element={<HomePage />} />
    <Route path={ROUTES.AUTH_ROUTES.login} element={<SignIn />} />
    <Route path={'*'} element={<Navigate to={ROUTES.AUTH_ROUTES.login} replace />} />
  </Routes>
);

export default React.memo(PublicRoutes);
