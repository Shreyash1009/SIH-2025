import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MyReportsPage from './pages/MyReportsPage';
import HazardMap from './components/HazardMap';

// Enhanced Layout component that conditionally shows NavBar
function Layout({ children, hideNavBar = false }) {
  return (
    <div>
      {!hideNavBar && <NavBar />}
      <main>{children}</main>
    </div>
  );
}

// Component to handle navbar visibility based on route
function AppContent() {
  const location = useLocation();
  
  // Hide navbar on login and signup pages
  const hideNavBar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes with navbar */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/leaderboard" element={<Layout><LeaderboardPage /></Layout>} />
        
        {/* Authentication routes without navbar */}
        <Route path="/login" element={<Layout hideNavBar={true}><LoginPage /></Layout>} />
        <Route path="/signup" element={<Layout hideNavBar={true}><SignupPage /></Layout>} />
        
        {/* Standalone map route without navbar */}
        <Route path="/map" element={<HazardMap />} />
        
        {/* Protected routes with navbar - Report redirects to signup if not logged in */}
        <Route 
          path="/report" 
          element={
            <ProtectedRoute redirectToSignup={true}>
              <Layout><ReportPage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard route - only for authorities/admin */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/my-reports" 
          element={
            <ProtectedRoute>
              <Layout><MyReportsPage /></Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* 404 page */}
        <Route path="*" element={
          <Layout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <Link to="/" className="text-primary hover:underline">Return Home</Link>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}