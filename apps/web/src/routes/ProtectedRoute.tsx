import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import LoadingScreen from '@src/components/LoadingScreen';

export const ProtectedRoute = (): JSX.Element => {
  const { token, loading, initializing } = useSelector((state: RootState) => state.authSlice);

  if (initializing || loading) {
    return <LoadingScreen />;
  }

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};
