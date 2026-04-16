import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { patientAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Users, UserPlus, FileText, Activity } from 'lucide-react'

/**
 * Dashboard - Admin home page showing stats and quick actions.
 *
 * useEffect -> Runs side effects (API calls) after component renders.
 *   Dependency array [] -> runs only once on mount (like componentDidMount).
 *
 * Async data fetching pattern:
 *   Define async function inside useEffect (can't make useEffect itself async).
 *   Call it immediately.
 *   Handle loading and error states.
 */
export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, recent: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await patientAPI.getAll()
        const patients = res.data
        setStats({
          total: patients.length,
          recent: patients.slice(0, 5),
          totalNotes: patients.reduce((sum, p) => sum + (p.notes?.length || 0), 0)
        })
      } catch (err) {
        console.error('Failed to load stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Patients', value: stats.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Reports', value: stats.totalNotes || 0, icon: FileText, color: 'bg-green-600' },
    { label: 'Active Today', value: stats.recent?.length || 0, icon: Activity, color: 'bg-purple-500' },
  ]

  return (
    <div>
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold text-gray-800">
          Welcome, {user?.fullName} 👋
        </h1>
        <p className="text-gray-500 mt-1">Hari Om Homeopathic Clinic — Patient Management</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card flex items-center gap-5"
          >
            <div className={`${color} p-4 rounded-2xl text-white`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent patients */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Patients</h2>
            <Link to="/admin/patients" className="text-green-700 text-sm hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats.recent.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No patients yet</p>
          ) : (
            <div className="space-y-2">
              {stats.recent.map(p => (
                <Link key={p.id} to={`/admin/patients/${p.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.location} · Age {p.age}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{p.notes?.length || 0} notes</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick action */}
        <div className="card flex flex-col items-center justify-center text-center gap-4 py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-green-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">New Patient</h3>
            <p className="text-gray-400 text-sm mt-1">Register a new patient and start their record</p>
          </div>
          <Link to="/admin/patients" className="btn-primary">
            Add New Patient
          </Link>
        </div>
      </div>
    </div>
  )
}
