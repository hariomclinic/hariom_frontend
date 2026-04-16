import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { patientAPI } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Phone, MapPin, User, Clock } from 'lucide-react'

/**
 * PatientDetail - Full patient record page with notes management.
 *
 * useParams() -> Extracts URL parameters. Here: /admin/patients/:id -> { id: "5" }
 *
 * Note editing pattern:
 *   editingNoteId -> tracks which note is currently being edited (null = none)
 *   editContent -> the textarea value while editing
 *   On save -> API call -> update local state (optimistic or refetch)
 *
 * date-fns format() -> Formats LocalDateTime from backend to readable string.
 *   "dd MMM yyyy, hh:mm a" -> "15 Jan 2024, 10:30 AM"
 *
 * Inline editing UX:
 *   Click edit icon -> textarea appears with current content
 *   Click save -> API PUT call -> update note in state
 *   Click cancel -> revert to display mode
 */
export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editingPatient, setEditingPatient] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchPatient()
  }, [id])

  const fetchPatient = async () => {
    try {
      const res = await patientAPI.getById(id)
      setPatient(res.data)
      setEditForm({
        name: res.data.name,
        age: res.data.age,
        mobileNumber: res.data.mobileNumber,
        location: res.data.location,
      })
    } catch {
      toast.error('Patient not found')
      navigate('/admin/patients')
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setAddingNote(true)
    try {
      const res = await patientAPI.addNote(id, { content: newNote })
      setPatient(prev => ({ ...prev, notes: [res.data, ...prev.notes] }))
      setNewNote('')
      toast.success('Note added')
    } catch {
      toast.error('Failed to add note')
    } finally {
      setAddingNote(false)
    }
  }

  const handleUpdateNote = async (noteId) => {
    if (!editContent.trim()) return
    try {
      const res = await patientAPI.updateNote(id, noteId, { content: editContent })
      setPatient(prev => ({
        ...prev,
        notes: prev.notes.map(n => n.id === noteId ? res.data : n)
      }))
      setEditingNoteId(null)
      toast.success('Note updated')
    } catch {
      toast.error('Failed to update note')
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await patientAPI.deleteNote(id, noteId)
      setPatient(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }))
      toast.success('Note deleted')
    } catch {
      toast.error('Failed to delete note')
    }
  }

  const handleUpdatePatient = async (e) => {
    e.preventDefault()
    try {
      const res = await patientAPI.update(id, { ...editForm, age: parseInt(editForm.age) })
      setPatient(prev => ({ ...prev, ...res.data }))
      setEditingPatient(false)
      toast.success('Patient updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  const formatDate = (dateStr) => {
    try { return format(new Date(dateStr), 'dd MMM yyyy, hh:mm a') }
    catch { return dateStr }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button onClick={() => navigate('/admin/patients')}
        className="flex items-center gap-2 text-gray-500 hover:text-green-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Patients
      </button>

      {/* Patient Info Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
        {!editingPatient ? (
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full
                              flex items-center justify-center text-green-800 font-bold text-2xl">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-800">{patient.name}</h1>
                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <User className="w-4 h-4" /> Age {patient.age}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="w-4 h-4" /> {patient.mobileNumber}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" /> {patient.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Clock className="w-4 h-4" /> Registered: {formatDate(patient.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setEditingPatient(true)}
              className="flex items-center gap-2 text-sm text-green-700 border border-green-200
                         px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdatePatient} className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Edit Patient Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'age', label: 'Age', type: 'number' },
                { key: 'mobileNumber', label: 'Mobile', type: 'tel' },
                { key: 'location', label: 'Location', type: 'text' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input type={type} value={editForm[key]}
                    onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                    className="input-field" required />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
              <button type="button" onClick={() => setEditingPatient(false)}
                className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Notes Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-800">
            Patient Notes <span className="text-green-600 text-base">({patient.notes?.length || 0})</span>
          </h2>
        </div>

        {/* Add new note */}
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Add New Note / Report</p>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Write patient report, symptoms, prescription, observations..."
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddNote}
              disabled={addingNote || !newNote.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingNote
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Plus className="w-4 h-4" />
              }
              Add Note
            </button>
          </div>
        </div>

        {/* Notes list */}
        {patient.notes?.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No notes yet. Add the first report above.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {patient.notes.map((note, i) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-gray-100 rounded-xl p-5 hover:border-green-200 transition-colors"
                >
                  {editingNoteId === note.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={5}
                        className="input-field resize-none mb-3"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateNote(note.id)}
                          className="btn-primary flex items-center gap-1.5 text-sm py-2">
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button onClick={() => setEditingNoteId(null)}
                          className="border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap flex-1">
                          {note.content}
                        </p>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => { setEditingNoteId(note.id); setEditContent(note.content) }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
                        <span className="text-xs text-gray-400">
                          Created: {formatDate(note.createdAt)}
                        </span>
                        {note.updatedAt !== note.createdAt && (
                          <span className="text-xs text-green-500">
                            Edited: {formatDate(note.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
