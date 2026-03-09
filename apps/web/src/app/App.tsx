import { JSX, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../redux/store';
import HomePage from '../pages/HomePage';
import Layout from '../components/Layout';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ResetPassword from '../pages/ResetPassword';
import ForgotPassword from '../pages/ForgotPassword';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { PROTECTED_ROUTES } from '../routes/routes';
import { getCurrentUser } from '../services/auth';

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      void dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {PROTECTED_ROUTES.map((route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
