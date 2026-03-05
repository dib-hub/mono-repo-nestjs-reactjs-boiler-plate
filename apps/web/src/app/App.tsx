import { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import Layout from '../components/Layout';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ResetPassword from '../pages/ResetPassword';
import ForgotPassword from '../pages/ForgotPassword';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PROTECTED_ROUTES } from '../routes/routes';

function App(): JSX.Element {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* protected */}
        {PROTECTED_ROUTES.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </Layout>
  );
}

export default App;
