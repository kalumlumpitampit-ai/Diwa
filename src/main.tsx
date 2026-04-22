import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix Capacitor Firebase Auth Missing Initial State Error
import { App as CapacitorApp } from '@capacitor/app';
if (typeof window !== 'undefined' && (window as any).Capacitor && (window as any).Capacitor.isNative) {
  CapacitorApp.addListener('appUrlOpen', data => {
    // When the app reopens after the Android system browser Google Sign In finishes,
    // we must manually hand the return URL containing the OAuth tokens over to the local webview
    if (data.url && data.url.includes('apiKey=') || data.url.includes('authType=')) {
      window.location.href = data.url;
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
