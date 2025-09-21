import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css'; // Keep this for the map later
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // 👈 1. IMPORT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 👈 2. WRAP your App */}
      <App />
    </AuthProvider>
  </StrictMode>,
);