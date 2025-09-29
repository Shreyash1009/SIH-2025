import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Import Components
import Banner from './components/Banner'; // <-- 1. Import the Banner component
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import HazardMap from './components/HazardMap';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ReportPage from './pages/ReportPage';
import DashboardAuthority from './pages/DashboardAuthority';
import DashboardAnalyst from './pages/DashboardAnalyst';
import LeaderboardPage from './pages/LeaderboardPage';
import MyReportsPage from './pages/MyReportsPage';

// This Layout component now controls the visibility of both Banner and NavBar
function Layout({ children }) {
  const location = useLocation();
  // Use a more descriptive variable name
  const hideHeaderAndNav = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <div>
      {/* 2. Conditionally render both Banner and NavBar together */}
      {!hideHeaderAndNav && (
        <>
          <Banner />
          <NavBar />
        </>
      )}
      <main>{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected (any logged-in user) */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
        <Route path="/my-reports" element={<ProtectedRoute><MyReportsPage /></ProtectedRoute>} />

        {/* Role-specific Routes */}
        {/* Authority Dashboard - for officials and admins */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['official', 'admin']}>
              <DashboardAuthority />
            </ProtectedRoute>
          }
        />

        {/* Analyst Dashboard - for analysts */}
        <Route
          path="/analyst-dashboard"
          element={
            <ProtectedRoute allowedRoles={['analyst']}>
              <DashboardAnalyst />
            </ProtectedRoute>
          }
        />

        {/* Public map (adjust if needed) */}
        <Route path="/map" element={<HazardMap />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
