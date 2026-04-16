import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { patientAPI } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Search, UserPlus, Trash2, ChevronRight, Phone, MapPin, Users } from 'lucide-react'

/**
 * PatientList - Shows all patients with search, add, and delete functionality.
 *
 * useCallback -> Memoizes a function so it doesn't get recreated on every render.
 *   Used here to prevent infinite loops when fetchPatients is in useEffect deps.
 *
 * AnimatePresence -> framer-motion: enables exit animations when components unmount.
 *   Without it, components just disappear instantly when removed from DOM.
 *
 * Controlled form -> React controls the input value via state.
 *   onChange updates state -> state updates input value (two-way binding).
 */
export default function PatientList() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', age: '', mobileNumber: '', location: '' })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const fetchPatients = useCallback(async () => {
    try {
      const res = await patientAPI.getAll(search)
      setPatients(res.data)
    } catch {
      toast.error('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }, [search])

  // Re-fetch when search changes (debounce-like via useEffect)
  useEffect(() => {
    const timer = setTimeout(fetchPatients, 300) // 300ms debounce
    return () => clearTimeout(timer) // Cleanup: cancel previous timer
  }, [fetchPatients])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await patientAPI.create({ ...form, age: parseInt(form.age) })
      toast.success('Patient added successfully')
      setShowForm(false)
      setForm({ name: '', age: '', mobileNumber: '', location: '' })
      navigate(`/admin/patients/${res.data.id}`)
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach(msg => toast.error(msg))
      } else {
        toast.error(err.response?.data?.message || 'Failed to add patient')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.preventDefault() // Prevent Link navigation
    e.stopPropagation()
    if (!window.confirm('Delete this patient and all their records?')) return
    try {
      await patientAPI.delete(id)
      setPatients(prev => prev.filter(p => p.id !== id))
      toast.success('Patient deleted')
    } catch {
      toast.error('Failed to delete patient')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Patients</h1>
          <p className="text-gray-500 text-sm mt-0.5">{patients.length} total records</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> New Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {/* New Patient Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">New Patient</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                {[
                  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Patient full name' },
                  { key: 'age', label: 'Age', type: 'number', placeholder: 'Age in years' },
                  { key: 'mobileNumber', label: 'Mobile Number', type: 'tel', placeholder: '10-digit mobile number' },
                  { key: 'location', label: 'Location', type: 'text', placeholder: 'Village / City' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                      className="input-field"
                      placeholder={placeholder}
                      required
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center">
                    {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Add Patient'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No patients found</p>
          <p className="text-sm mt-1">Click "New Patient" to add the first record</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {patients.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/admin/patients/${patient.id}`}>
                  <div className="card hover:shadow-lg transition-all hover:border-green-200 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full
                                        flex items-center justify-center text-green-800 font-bold text-lg">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                            {patient.name}
                          </p>
                          <div className="flex items-center gap-4 mt-0.5">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {patient.mobileNumber}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {patient.location}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Age {patient.age}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{patient.notes?.length || 0} notes</span>
                        <button
                          onClick={(e) => handleDelete(e, patient.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
