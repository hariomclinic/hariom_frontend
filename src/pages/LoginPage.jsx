import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Stethoscope } from 'lucide-react'

/**
 * LoginPage - Admin login form.
 *
 * useState -> Local state for form fields and UI state (loading, showPassword)
 * useNavigate -> Redirect to dashboard after successful login
 * useAuth -> Access the login() function from AuthContext
 *
 * Form submission flow:
 *   1. User submits form
 *   2. setLoading(true) -> shows spinner
 *   3. auth.login(username, password) -> calls authAPI.login() -> Spring Boot /api/auth/login
 *   4. On success -> JWT stored in localStorage -> navigate to /admin
 *   5. On error -> toast.error() shows error message
 *
 * toast -> react-hot-toast: shows non-blocking notification messages
 */
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default HTML form submission (page reload)
    setLoading(true)
    try {
      await login(username, password)
      toast.success('Welcome, Doctor!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-700 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Stethoscope className="w-10 h-10 text-green-800" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Hari Om Clinic</h1>
            <p className="text-green-200 text-sm mt-1">Doctor Login Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Login'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              <a href="/" className="text-green-700 hover:underline">← Back to Website</a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
