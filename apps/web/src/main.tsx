import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@src/styles/globals.css';
import { store } from '@src/redux/store';
import App from '@src/app/App';

const googleClientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string;

if (!googleClientId) {
  console.warn('VITE_GOOGLE_CLIENT_ID is missing. Google sign-in will not be available.');
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId ?? ''}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
