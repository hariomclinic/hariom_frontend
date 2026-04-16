import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Users, LayoutDashboard, LogOut, Stethoscope } from 'lucide-react'
import doctorImg from '../assets/doctor.jpeg'

/**
 * Layout.jsx - Shared admin layout with sidebar navigation.
 *
 * Outlet -> React Router v6: renders the matched child route component.
 *   Like a slot where child pages are injected.
 *
 * useLocation() -> Returns current URL location object.
 *   Used to highlight the active nav link.
 *
 * useNavigate() -> Returns a function to programmatically navigate.
 *   Used for logout redirect.
 */
export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/patients', label: 'Patients', icon: Users },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-green-800" />
            </div>
            <div>
              <p className="font-bold text-sm">Hari Om Clinic</p>
              <p className="text-green-300 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Doctor info */}
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-3">
            <img
              src={doctorImg}
              alt="Doctor"
              className="w-10 h-10 rounded-full border-2 border-green-400"
            />
            <div>
              <p className="text-sm font-semibold">{user?.fullName}</p>
              <p className="text-green-300 text-xs">Homeopathic Physician</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-white text-green-800 font-semibold shadow-md'
                    : 'text-green-100 hover:bg-green-700'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                       text-green-100 hover:bg-red-600 hover:text-white transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
