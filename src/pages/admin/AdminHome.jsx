import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import { getOrganizationTeachers } from '../../services/organizationService'
import { getAttendanceRecords } from '../../services/attendanceService'
import { exportAttendanceToExcel } from '../../services/exportService'
import { useRoleLabels } from '../../hooks/useRoleLabels'
import toast from 'react-hot-toast'

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    todayAttendance: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [user])

  const loadStats = async () => {
    try {
      const teachers = await getOrganizationTeachers(user.organizationId)
      const attendance = await getAttendanceRecords({ organizationId: user.organizationId })
      
      const today = new Date().toDateString()
      const todayRecords = attendance.filter(
        record => new Date(record.timestamp).toDateString() === today
      )

      setStats({
        totalTeachers: teachers.length,
        totalStudents: 0,
        todayAttendance: todayRecords.length,
      })
    } catch (error) {
      console.error('Stats loading error:', error)
      toast.error('Failed to load statistics. Please refresh the page or contact support.')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const records = await getAttendanceRecords({ organizationId: user.organizationId })
      exportAttendanceToExcel(records, 'organization_attendance')
      toast.success('Attendance exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export attendance. Please try again or contact support.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={`Total ${labels.teachers}`}
          value={stats.totalTeachers}
          icon={<span className="text-2xl">👨‍🏫</span>}
          color="blue"
        />
        <StatCard
          title={`Total ${labels.students}`}
          value={stats.totalStudents}
          icon={<span className="text-2xl">👨‍🎓</span>}
          color="green"
        />
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance}
          icon={<span className="text-2xl">✅</span>}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/teachers" className="block">
              <button className="w-full btn-primary text-left">
                Manage {labels.teachers}
              </button>
            </Link>
            <button onClick={handleExport} className="w-full btn-secondary text-left">
              Export All Attendance
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Organization Info</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Admin:</span> {user?.name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
