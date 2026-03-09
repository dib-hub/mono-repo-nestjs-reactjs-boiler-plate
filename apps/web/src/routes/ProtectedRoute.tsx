import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

export const ProtectedRoute = (): JSX.Element => {
  const { token, loading } = useSelector((state: RootState) => state.authSlice);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};
