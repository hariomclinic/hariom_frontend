import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

/**
 * AuthContext - Global authentication state management.
 *
 * React Context API:
 *   createContext() -> Creates a context object
 *   Provider -> Wraps the app, makes value available to all children
 *   useContext() -> Consumes the context value in any child component
 *
 * Why Context instead of prop drilling?
 *   Without context: App -> Layout -> Navbar -> UserMenu (pass user as prop 3 levels)
 *   With context: UserMenu directly reads from AuthContext (no prop drilling)
 *
 * State persistence:
 *   On login -> save token + user to localStorage (survives page refresh)
 *   On mount (useEffect) -> read from localStorage to restore session
 *   On logout -> clear localStorage + reset state
 *
 * Custom hook useAuth() -> Convenience wrapper so components don't need to
 *   import both useContext and AuthContext separately.
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const response = await authAPI.login({ username, password })
    const { token, fullName } = response.data
    const userData = { username, fullName }

    // Persist to localStorage for session continuity
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = { user, login, logout, isAuthenticated: !!user, loading }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook - components call useAuth() instead of useContext(AuthContext)
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
