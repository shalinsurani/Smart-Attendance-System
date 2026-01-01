import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaEnvelope, FaUser, FaBook } from 'react-icons/fa'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { createQuery } from '../../services/queryService'
import toast from 'react-hot-toast'

const ContactTeacherModal = ({ isOpen, onClose, studentId, studentName, organizationId }) => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    teacherId: '',
    teacherName: '',
    topic: '',
    message: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadTeachers()
    }
  }, [isOpen, organizationId])

  const loadTeachers = async () => {
    try {
      const teachersQuery = query(
        collection(db, 'users'),
        where('organizationId', '==', organizationId),
        where('role', '==', 'teacher')
      )
      const snapshot = await getDocs(teachersQuery)
      const teachersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTeachers(teachersList)
    } catch (error) {
      console.error('Error loading teachers:', error)
      toast.error('Failed to load teachers')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.teacherId) {
        throw new Error('Please select a teacher')
      }

      await createQuery({
        type: 'contact_teacher',
        studentId,
        studentName,
        teacherId: formData.teacherId,
        teacherName: formData.teacherName,
        topic: formData.topic,
        message: formData.message,
        organizationId
      })

      toast.success('Message sent to teacher successfully!')
      setFormData({ teacherId: '', teacherName: '', topic: '', message: '' })
      onClose()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const handleTeacherChange = (e) => {
    const selectedTeacher = teachers.find(t => t.id === e.target.value)
    setFormData({
      ...formData,
      teacherId: e.target.value,
      teacherName: selectedTeacher?.name || ''
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <FaEnvelope className="mr-2" />
                  Contact Teacher
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-indigo-600" />
                  Select Teacher
                </label>
                <select
                  value={formData.teacherId}
                  onChange={handleTeacherChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  required
                >
                  <option value="">-- Select a teacher --</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBook className="inline mr-2 text-indigo-600" />
                  Topic/Subject
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="e.g., Attendance Query, Class Doubt"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-indigo-600" />
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  rows="5"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ContactTeacherModal
