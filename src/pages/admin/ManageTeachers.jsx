import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { createUser, updateUser, deleteUser } from '../../services/userService'
import { getOrganizationTeachers } from '../../services/organizationService'
import { useRoleLabels } from '../../hooks/useRoleLabels'
import toast from 'react-hot-toast'
import { FaEdit, FaTrash } from 'react-icons/fa'

const ManageTeachers = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [teachers, setTeachers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: '',
    department: '',
    designation: '',
    employeeId: '',
    dateOfJoining: '',
    status: 'Active'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTeachers()
  }, [user])

  const loadTeachers = async () => {
    try {
      const data = await getOrganizationTeachers(user.organizationId)
      setTeachers(data)
    } catch (error) {
      console.error(`${labels.teachers} loading error:`, error)
      toast.error(`Failed to load ${labels.teachers.toLowerCase()}. Please refresh the page or contact support.`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingTeacher) {
        // Update existing teacher
        await updateUser(editingTeacher.uid, {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          department: formData.department,
          designation: formData.designation,
          employeeId: formData.employeeId,
          dateOfJoining: formData.dateOfJoining,
          status: formData.status
        })
        toast.success(`${labels.teacher} updated successfully!`)
      } else {
        // Add new teacher
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )

        await createUser({
          uid: userCredential.user.uid,
          name: formData.name,
          email: formData.email,
          role: 'teacher',
          organizationId: user.organizationId,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          department: formData.department,
          designation: formData.designation,
          employeeId: formData.employeeId,
          dateOfJoining: formData.dateOfJoining,
          status: formData.status
        })

        toast.success(`${labels.teacher} added successfully!`)
      }

      setFormData({ name: '', email: '', password: '' })
      setShowForm(false)
      setEditingTeacher(null)
      loadTeachers()
    } catch (error) {
      console.error(`${labels.teacher} save error:`, error)
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'This email is already registered. Please use a different email.'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address. Please check and try again.'
        : error.code === 'auth/weak-password'
        ? 'Password is too weak. Please use at least 6 characters.'
        : error.message || `Failed to save ${labels.teacher.toLowerCase()}. Please try again or contact support.`
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: '',
      phoneNumber: teacher.phoneNumber || '',
      gender: teacher.gender || '',
      department: teacher.department || '',
      designation: teacher.designation || '',
      employeeId: teacher.employeeId || '',
      dateOfJoining: teacher.dateOfJoining || '',
      status: teacher.status || 'Active'
    })
    setShowForm(true)
  }

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteUser(teacher.uid)
      toast.success(`${labels.teacher} deleted successfully!`)
      loadTeachers()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Failed to delete ${labels.teacher.toLowerCase()}. Please try again.`)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTeacher(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      gender: '',
      department: '',
      designation: '',
      employeeId: '',
      dateOfJoining: '',
      status: 'Active'
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage {labels.teachers}</h1>
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
          {showForm ? 'Cancel' : `Add ${labels.teacher}`}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTeacher ? `Edit ${labels.teacher}` : `Add New ${labels.teacher}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Row 2: Password and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editingTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="input-field"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            {/* Row 3: Gender and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department / Subject Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Computer Science, Mathematics"
                  required
                />
              </div>
            </div>

            {/* Row 4: Designation and Employee ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Senior Teacher">Senior Teacher</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Lab Instructor">Lab Instructor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID / Teacher ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="input-field"
                  placeholder="e.g., EMP001"
                  required
                />
              </div>
            </div>

            {/* Row 5: Date of Joining and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {editingTeacher && (
              <p className="text-sm text-gray-600 italic bg-yellow-50 p-2 rounded">
                Note: Password cannot be changed through this form
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : editingTeacher ? 'Update' : `Add ${labels.teacher}`}
              </button>
              {editingTeacher && (
                <button type="button" onClick={handleCancelForm} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold mb-4">{labels.teachers} List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.uid}>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageTeachers
