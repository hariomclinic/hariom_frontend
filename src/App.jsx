import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import SplashScreen from './components/SplashScreen'
import PublicWebsite from './pages/PublicWebsite'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/PatientList'
import PatientDetail from './pages/PatientDetail'
import Layout from './components/Layout'

/**
 * App.jsx - Root component with routing configuration.
 *
 * React Router v6:
 *   BrowserRouter -> Uses HTML5 history API for clean URLs (/login, /dashboard)
 *   Routes -> Container for all Route definitions
 *   Route -> Maps a URL path to a component
 *   Navigate -> Programmatic redirect
 *
 * ProtectedRoute -> HOC (Higher Order Component) pattern:
 *   Checks if user is authenticated.
 *   If yes -> renders the child component.
 *   If no -> redirects to /login.
 *   This protects all admin routes from unauthenticated access.
 *
 * SplashScreen -> Shows on first load for 3 seconds, then fades out.
 */

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
  </div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) return <SplashScreen />

  return (
    <Routes>
      {/* Public website - no auth needed */}
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/:id" element={<PatientDetail />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {/* Toaster - global toast notification system */}
        <Toaster
          position="top-right"
          toastOptions={{
            success: { style: { background: '#166534', color: 'white' } },
            error: { style: { background: '#dc2626', color: 'white' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
