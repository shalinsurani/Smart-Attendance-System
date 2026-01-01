import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createClass, getClassesByTeacher, getClassesByOrganization, updateClass, deleteClass } from '../../services/classService'
import { useRoleLabels } from '../../hooks/useRoleLabels'
import toast from 'react-hot-toast'
import { FaEdit, FaTrash } from 'react-icons/fa'

const ManageClasses = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [classes, setClasses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    classCode: '',
    department: '',
    location: '',
    classType: 'Lecture'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClasses()
  }, [user])

  const loadClasses = async () => {
    try {
      // Admin can see all classes, teacher sees only their classes
      const data = user.role === 'admin' 
        ? await getClassesByOrganization(user.organizationId)
        : await getClassesByTeacher(user.uid, user.organizationId)
      setClasses(data)
    } catch (error) {
      console.error(`${labels.classes} loading error:`, error)
      toast.error(`Failed to load ${labels.classes.toLowerCase()}. Please refresh the page or contact support.`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingClass) {
        // Update existing class
        await updateClass(editingClass.id, {
          name: formData.name,
          subject: formData.subject,
          classCode: formData.classCode,
          department: formData.department,
          location: formData.location,
          classType: formData.classType,
          updatedAt: new Date().toISOString()
        })
        toast.success(`${labels.class} updated successfully!`)
      } else {
        // Create new class
        await createClass({
          ...formData,
          teacherId: user.uid,
          teacherName: user.name,
          organizationId: user.organizationId,
        })
        toast.success(`${labels.class} created successfully!`)
      }

      setFormData({ name: '', subject: '' })
      setShowForm(false)
      setEditingClass(null)
      loadClasses()
    } catch (error) {
      console.error(`${labels.class} save error:`, error)
      toast.error(`Failed to save ${labels.class.toLowerCase()}. Please check your input and try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cls) => {
    setEditingClass(cls)
    setFormData({
      name: cls.name,
      subject: cls.subject,
      classCode: cls.classCode || '',
      department: cls.department || '',
      location: cls.location || '',
      classType: cls.classType || 'Lecture'
    })
    setShowForm(true)
  }

  const handleDelete = async (cls) => {
    if (!window.confirm(`Are you sure you want to delete ${cls.name}? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteClass(cls.id)
      toast.success(`${labels.class} deleted successfully!`)
      loadClasses()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Failed to delete ${labels.class.toLowerCase()}. Please try again.`)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingClass(null)
    setFormData({
      name: '',
      subject: '',
      classCode: '',
      department: '',
      location: '',
      classType: 'Lecture'
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage {labels.classes}</h1>
        <button 
          onClick={() => {
            if (showForm) {
              handleCancelForm()
            } else {
              setShowForm(true)
            }
          }} 
          className="btn-primary"
        >
          {showForm ? 'Cancel' : `Create ${labels.class}`}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingClass ? `Edit ${labels.class}` : `Create New ${labels.class}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Class Name and Class Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.class} / Lecture Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Computer Science 101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.classCode}
                  onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                  className="input-field"
                  placeholder="e.g., CS101"
                  required
                />
              </div>
            </div>

            {/* Row 2: Department and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Programming"
                  required
                />
              </div>
            </div>

            {/* Row 3: Location and Class Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Room 101, Building A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Type
                </label>
                <select
                  value={formData.classType}
                  onChange={(e) => setFormData({ ...formData, classType: e.target.value })}
                  className="input-field"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Office Shift">Office Shift</option>
                </select>
              </div>
            </div>

            {/* Teacher Assigned (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher Assigned
              </label>
              <input
                type="text"
                value={user.name}
                className="input-field bg-gray-100"
                disabled
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : editingClass ? 'Update' : `Create ${labels.class}`}
              </button>
              {editingClass && (
                <button type="button" onClick={handleCancelForm} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold mb-4">{labels.classes} List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(cls)}
                  className="text-blue-600 hover:text-blue-800 p-2"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(cls)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 pr-16">{cls.name}</h3>
              <p className="text-gray-600 mt-1">{cls.subject}</p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(cls.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        {classes.length === 0 && (
          <p className="text-center text-gray-500 py-8">No {labels.classes.toLowerCase()} created yet</p>
        )}
      </div>
    </div>
  )
}

export default ManageClasses
