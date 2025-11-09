import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

/* This is the most important import for your styles.
  It links the index.css file you just created.
*/
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>
  </React.StrictMode>
);