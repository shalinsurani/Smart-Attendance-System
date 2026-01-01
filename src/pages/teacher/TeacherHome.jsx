import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import { getStudentsByTeacher } from '../../services/studentService'
import { getClassesByTeacher } from '../../services/classService'
import { useRoleLabels } from '../../hooks/useRoleLabels'
import toast from 'react-hot-toast'

const TeacherHome = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    enrolledFaces: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [user])

  const loadStats = async () => {
    try {
      const students = await getStudentsByTeacher(user.uid, user.organizationId)
      const classes = await getClassesByTeacher(user.uid, user.organizationId)
      const enrolled = students.filter(s => s.faceEnrolled).length

      setStats({
        totalStudents: students.length,
        totalClasses: classes.length,
        enrolledFaces: enrolled,
      })
    } catch (error) {
      console.error('Stats loading error:', error)
      toast.error('Failed to load statistics. Please refresh the page or contact support.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={`Total ${labels.students}`}
          value={stats.totalStudents}
          icon={<span className="text-2xl">👨‍🎓</span>}
          color="blue"
        />
        <StatCard
          title={`Total ${labels.classes}`}
          value={stats.totalClasses}
          icon={<span className="text-2xl">📚</span>}
          color="green"
        />
        <StatCard
          title="Faces Enrolled"
          value={stats.enrolledFaces}
          icon={<span className="text-2xl">🎭</span>}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/teacher/students">
              <button className="w-full btn-primary text-left">Manage {labels.students}</button>
            </Link>
            <Link to="/teacher/classes">
              <button className="w-full btn-primary text-left">Manage {labels.classes}</button>
            </Link>
            <Link to="/teacher/attendance">
              <button className="w-full btn-primary text-left">Start Attendance</button>
            </Link>
            <Link to="/teacher/view-attendance">
              <button className="w-full btn-secondary text-left">View Attendance</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherHome
