import { JSX, lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@src/redux/store';
import Layout from '@src/components/Layout';
import LoadingScreen from '@src/components/LoadingScreen';
import { ErrorBoundary } from '@src/components/ErrorBoundary';
import { ProtectedRoute } from '@src/routes/ProtectedRoute';
import { PROTECTED_ROUTES } from '@src/routes/routes';
import { getCurrentUser } from '@src/services/auth';

const HomePage = lazy(() => import('@src/pages/HomePage'));
const PricingPage = lazy(() => import('@src/pages/PricingPage'));
const AboutPage = lazy(() => import('@src/pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('@src/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@src/pages/TermsOfServicePage'));
const SignIn = lazy(() => import('@src/pages/SignIn'));
const SignUp = lazy(() => import('@src/pages/SignUp'));
const ResetPassword = lazy(() => import('@src/pages/ResetPassword'));
const ForgotPassword = lazy(() => import('@src/pages/ForgotPassword'));
const NotFound = lazy(() => import('@src/pages/NotFound'));

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { initializing, token, user } = useSelector((state: RootState) => state.authSlice);

  useEffect(() => {
    if (token && !user) {
      void dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
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
