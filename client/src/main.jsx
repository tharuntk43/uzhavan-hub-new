import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Register Progressive Web App Service Worker
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('[Uzhavan Hub PWA] Service worker registered successfully:', reg.scope);
      })
      .catch(err => {
        console.warn('[Uzhavan Hub PWA] Service worker registration skipped/failed:', err);
      });
  });
}
