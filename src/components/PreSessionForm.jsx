import { useState } from 'react'
import { useRoleLabels } from '../hooks/useRoleLabels'

const PreSessionForm = ({ classes, onSubmit, onCancel }) => {
  const labels = useRoleLabels()
  const [formData, setFormData] = useState({
    classId: '',
    subject: '',
    topic: '',
    duration: '60',
    sessionType: 'Lecture',
    notes: ''
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.classId) newErrors.classId = `Please select a ${labels.class.toLowerCase()}`
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required'
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const selectedClass = classes.find(c => c.id === formData.classId)
      onSubmit({
        ...formData,
        className: selectedClass?.name || ''
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Session Details</h2>
        <p className="text-gray-600 mb-6">Please provide session information before starting attendance</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select {labels.class} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className={`input-field ${errors.classId ? 'border-red-500' : ''}`}
            >
              <option value="">Choose a {labels.class.toLowerCase()}</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            {errors.classId && <p className="text-red-500 text-sm mt-1">{errors.classId}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
              placeholder="e.g., Mathematics, Physics, Computer Science"
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className={`input-field ${errors.topic ? 'border-red-500' : ''}`}
              placeholder="e.g., Calculus - Derivatives, Newton's Laws"
            />
            {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic}</p>}
          </div>

          {/* Duration and Session Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={`input-field ${errors.duration ? 'border-red-500' : ''}`}
                min="1"
                max="300"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <select
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                className="input-field"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Practical">Practical</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Any additional information about this session..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Start Attendance Session
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Session Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All fields marked with * are required</li>
          <li>• Session details will be saved with attendance records</li>
          <li>• Duration helps track lecture timing</li>
          <li>• You can add notes for future reference</li>
        </ul>
      </div>
    </div>
  )
}

export default PreSessionForm
