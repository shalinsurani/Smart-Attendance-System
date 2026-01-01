import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaUserGraduate, FaChalkboardTeacher, FaChartLine, FaCalendarCheck } from 'react-icons/fa'
import StatCard from '../../components/dashboard/StatCard'
import AttendanceLineChart from '../../components/charts/LineChart'
import AttendanceBarChart from '../../components/charts/BarChart'
import AttendancePieChart from '../../components/charts/PieChart'
import { getAdminAnalytics } from '../../services/analyticsService'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const AdminHomeEnhanced = () => {
  const { user } = useSelector((state) => state.auth)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [user])

  const loadAnalytics = async () => {
    try {
      const data = await getAdminAnalytics(user.organizationId)
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={analytics.overview.totalStudents}
          icon={<FaUserGraduate />}
          color="indigo"
        />
        <StatCard
          title="Total Teachers"
          value={analytics.overview.totalTeachers}
          icon={<FaChalkboardTeacher />}
          color="green"
        />
        <StatCard
          title="Total Classes"
          value={analytics.overview.totalClasses}
          icon={<FaChartLine />}
          color="purple"
        />
        <StatCard
          title="Today's Attendance"
          value={`${analytics.overview.todayAttendanceRate}%`}
          icon={<FaCalendarCheck />}
          color="blue"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceLineChart
          data={analytics.trends}
          title="Attendance Trend (Last 7 Days)"
        />
        <AttendancePieChart
          data={analytics.distribution}
          title="Overall Attendance Distribution"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        <AttendanceBarChart
          data={analytics.classStats}
          title="Class-wise Attendance Comparison"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {analytics.recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activities</p>
          ) : (
            analytics.recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{activity.studentName}</p>
                    <p className="text-sm text-gray-600">{activity.className}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    activity.status === 'present' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.status === 'present' ? 'Present' : 'Absent'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Class Statistics Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.classStats.map((cls, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cls.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">{cls.present}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">{cls.absent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{cls.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      cls.rate >= 75 ? 'bg-green-100 text-green-800' :
                      cls.rate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cls.rate}%
                    </span>
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

export default AdminHomeEnhanced
