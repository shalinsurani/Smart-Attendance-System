import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { addStudent, getStudentsByTeacher, getStudentsByOrganization, updateStudent, updateStudentFace, deleteStudent } from '../../services/studentService'
import { getClassesByTeacher, getClassesByOrganization } from '../../services/classService'
import FaceCapture from '../../components/FaceCapture'
import { useRoleLabels } from '../../hooks/useRoleLabels'
import toast from 'react-hot-toast'
import { FaEdit, FaTrash } from 'react-icons/fa'

const ManageStudents = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showFaceCapture, setShowFaceCapture] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    rollNumber: '',
    phoneNumber: '',
    gender: '',
    classId: '',
    dateOfBirth: '',
    parentGuardianName: '',
    parentContactNumber: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStudents()
    loadClasses()
  }, [user])

  const loadStudents = async () => {
    try {
      // Admin can see all students, teacher sees only their students
      const data = user.role === 'admin'
        ? await getStudentsByOrganization(user.organizationId)
        : await getStudentsByTeacher(user.uid, user.organizationId)
      setStudents(data)
    } catch (error) {
      console.error(`${labels.students} loading error:`, error)
      toast.error(`Failed to load ${labels.students.toLowerCase()}. Please refresh the page or contact support.`)
    }
  }

  const loadClasses = async () => {
    try {
      // Admin can see all classes, teacher sees only their classes
      const data = user.role === 'admin'
        ? await getClassesByOrganization(user.organizationId)
        : await getClassesByTeacher(user.uid, user.organizationId)
      setClasses(data)
    } catch (error) {
      console.error('Classes loading error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingStudent) {
        // Update existing student
        const oldEmail = editingStudent.email
        await updateStudent(editingStudent.id, formData, oldEmail)
        
        if (oldEmail !== formData.email) {
          toast.success(`${labels.student} updated! Email changed - student must use new email to login.`)
        } else {
          toast.success(`${labels.student} updated successfully!`)
        }
      } else {
        // Add new student
        await addStudent({
          ...formData,
          organizationId: user.organizationId,
          teacherId: user.uid,
        })
        toast.success(`${labels.student} added successfully!`)
      }

      setFormData({ name: '', studentId: '', email: '' })
      setShowForm(false)
      setEditingStudent(null)
      loadStudents()
    } catch (error) {
      console.error(`${labels.student} save error:`, error)
      toast.error(`Failed to save ${labels.student.toLowerCase()}. Please check your input and try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      rollNumber: student.rollNumber || '',
      phoneNumber: student.phoneNumber || '',
      gender: student.gender || '',
      classId: student.classId || '',
      dateOfBirth: student.dateOfBirth || '',
      parentGuardianName: student.parentGuardianName || '',
      parentContactNumber: student.parentContactNumber || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteStudent(student.id)
      toast.success(`${labels.student} deleted successfully!`)
      loadStudents()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(`Failed to delete ${labels.student.toLowerCase()}. Please try again.`)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingStudent(null)
    setFormData({
      name: '',
      studentId: '',
      email: '',
      rollNumber: '',
      phoneNumber: '',
      gender: '',
      classId: '',
      dateOfBirth: '',
      parentGuardianName: '',
      parentContactNumber: ''
    })
  }

  const handleEnrollFace = (student) => {
    setSelectedStudent(student)
    setShowFaceCapture(true)
  }

  const handleFaceCapture = async (descriptor) => {
    try {
      await updateStudentFace(selectedStudent.id, descriptor)
      toast.success(`${labels.student} face enrolled successfully!`)
      setShowFaceCapture(false)
      setSelectedStudent(null)
      loadStudents()
    } catch (error) {
      console.error('Face enrollment error:', error)
      toast.error('Failed to enroll face. Please try again or contact support if the issue persists.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage {labels.students}</h1>
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
          {showForm ? 'Cancel' : `Add ${labels.student}`}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingStudent ? `Edit ${labels.student}` : `Add New ${labels.student}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name and ID/GR. Number */}
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
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID/GR. Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="input-field"
                  placeholder="e.g., STU001"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email and Roll Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="student@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number / Enrollment Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 2024001"
                  required
                />
              </div>
            </div>

            {/* Row 3: Phone Number and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="input-field"
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>
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
            </div>

            {/* Row 4: Class and Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.class} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select {labels.class}</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Row 5: Parent/Guardian Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.parentGuardianName}
                  onChange={(e) => setFormData({ ...formData, parentGuardianName: e.target.value })}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.parentContactNumber}
                  onChange={(e) => setFormData({ ...formData, parentContactNumber: e.target.value })}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Saving...' : editingStudent ? 'Update' : `Add ${labels.student}`}
              </button>
              {editingStudent && (
                <button type="button" onClick={handleCancelForm} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold mb-4">{labels.students} List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{labels.class}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Face</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const studentClass = classes.find(c => c.id === student.classId)
                return (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.rollNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{studentClass?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.phoneNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.faceEnrolled ? (
                        <span className="text-green-600 text-sm">✓ Enrolled</span>
                      ) : (
                        <span className="text-red-600 text-sm">✗ Not Enrolled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEnrollFace(student)}
                          className="text-primary hover:underline text-sm"
                        >
                          {student.faceEnrolled ? 'Re-enroll' : 'Enroll'}
                        </button>
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {students.length === 0 && (
            <p className="text-center text-gray-500 py-8">No {labels.students.toLowerCase()} added yet</p>
          )}
        </div>
      </div>

      {showFaceCapture && (
        <FaceCapture
          onCapture={handleFaceCapture}
          onCancel={() => {
            setShowFaceCapture(false)
            setSelectedStudent(null)
          }}
        />
      )}
    </div>
  )
}

export default ManageStudents
