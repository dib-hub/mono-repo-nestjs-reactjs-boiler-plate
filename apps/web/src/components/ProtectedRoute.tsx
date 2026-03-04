import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.authSlice);

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};
