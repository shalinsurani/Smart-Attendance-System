import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChalkboard, FaUserGraduate, FaChartLine, FaCalendarDay, FaPlay, FaEye, FaUsers } from 'react-icons/fa'
import StatCard from '../../components/dashboard/StatCard'
import AttendanceLineChart from '../../components/charts/LineChart'
import AttendanceBarChart from '../../components/charts/BarChart'
import { getTeacherAnalytics } from '../../services/analyticsService'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const TeacherHomeEnhanced = () => {
  const { user } = useSelector((state) => state.auth)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [user])

  const loadAnalytics = async () => {
    try {
      const data = await getTeacherAnalytics(user.uid, user.organizationId)
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
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
          title="My Classes"
          value={analytics.overview.totalClasses}
          icon={<FaChalkboard />}
          color="indigo"
        />
        <StatCard
          title="Total Students"
          value={analytics.overview.totalStudents}
          icon={<FaUserGraduate />}
          color="green"
        />
        <StatCard
          title="Avg Attendance"
          value={`${analytics.overview.avgAttendanceRate}%`}
          icon={<FaChartLine />}
          color="purple"
        />
        <StatCard
          title="Today's Sessions"
          value={analytics.overview.todaySessions}
          icon={<FaCalendarDay />}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/teacher/attendance"
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <FaPlay className="text-3xl" />
          <div>
            <p className="font-semibold text-lg">Start Attendance</p>
            <p className="text-sm text-indigo-100">Begin new session</p>
          </div>
        </Link>
        <Link
          to="/teacher/view-attendance"
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <FaEye className="text-3xl" />
          <div>
            <p className="font-semibold text-lg">View Attendance</p>
            <p className="text-sm text-green-100">Check records</p>
          </div>
        </Link>
        <Link
          to="/teacher/students"
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <FaUsers className="text-3xl" />
          <div>
            <p className="font-semibold text-lg">Manage Students</p>
            <p className="text-sm text-purple-100">Enroll & manage</p>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceLineChart
          data={analytics.trends}
          title="Weekly Attendance Trend"
        />
        <AttendanceBarChart
          data={analytics.classStats}
          title="Class-wise Performance"
        />
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
          <Link to="/teacher/view-attendance" className="text-indigo-600 hover:underline text-sm">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {analytics.recentSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent sessions</p>
          ) : (
            analytics.recentSessions.map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{session.className}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.timestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {session.presentCount}/{session.totalCount}
                  </p>
                  <p className="text-sm text-gray-600">Present</p>
                  <div className="mt-1">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(session.presentCount / session.totalCount) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Class Performance Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.classStats.map((cls, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cls.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">{cls.present}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">{cls.absent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      cls.rate >= 75 ? 'bg-green-100 text-green-800' :
                      cls.rate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cls.rate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to="/teacher/view-attendance"
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      View Details
                    </Link>
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

export default TeacherHomeEnhanced
