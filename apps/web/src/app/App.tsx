import { JSX, lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../redux/store';
import Layout from '../components/Layout';
import LoadingScreen from '../components/LoadingScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { PROTECTED_ROUTES } from '../routes/routes';
import { getCurrentUser } from '../services/auth';

const HomePage = lazy(() => import('../pages/HomePage'));
const SignIn = lazy(() => import('../pages/SignIn'));
const SignUp = lazy(() => import('../pages/SignUp'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const NotFound = lazy(() => import('../pages/NotFound'));

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { initializing, token } = useSelector((state: RootState) => state.authSlice);

  useEffect(() => {
    if (token) {
      void dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              {PROTECTED_ROUTES.map((route) => (
                <Route key={route.id} path={route.path} element={route.element} />
              ))}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
