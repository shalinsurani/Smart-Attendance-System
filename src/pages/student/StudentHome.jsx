import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { 
  FaCalendarCheck, 
  FaChartLine, 
  FaFire, 
  FaTrophy,
  FaChalkboard,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaFilter,
  FaSearch,
  FaBell,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaEnvelope,
  FaBook,
  FaUserGraduate,
  FaPercent
} from 'react-icons/fa'
import StatCard from '../../components/dashboard/StatCard'
import AttendancePieChart from '../../components/charts/PieChart'
import AttendanceBarChart from '../../components/charts/BarChart'
import AttendanceLineChart from '../../components/charts/LineChart'
import ContactTeacherModal from '../../components/modals/ContactTeacherModal'
import ReportIssueModal from '../../components/modals/ReportIssueModal'
import FAQsModal from '../../components/modals/FAQsModal'
import { getStudentAnalytics } from '../../services/studentAnalyticsService'
import { exportStudentAttendanceToExcel } from '../../services/exportService'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useRoleLabels } from '../../hooks/useRoleLabels'

const StudentHome = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal states
  const [showContactTeacher, setShowContactTeacher] = useState(false)
  const [showReportIssue, setShowReportIssue] = useState(false)
  const [showFAQs, setShowFAQs] = useState(false)

  useEffect(() => {
    loadAnalytics()
  }, [user])

  const loadAnalytics = async () => {
    try {
      const studentIdentifier = user.studentId || user.email
      if (!studentIdentifier) {
        throw new Error('Student identifier not found')
      }
      const data = await getStudentAnalytics(studentIdentifier, user.organizationId)
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics')
      setAnalytics({
        overview: {
          totalAttendance: 0,
          thisWeek: 0,
          thisMonth: 0,
          totalClasses: 0,
          currentStreak: 0,
          longestStreak: 0,
          attendancePercentage: 0,
          presentCount: 0,
          absentCount: 0
        },
        weeklyTrend: [],
        monthlyTrend: [],
        classStats: [],
        dayOfWeekStats: [],
        recentActivity: [],
        todayStatus: null
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = () => {
    try {
      if (!analytics?.allRecords || analytics.allRecords.length === 0) {
        toast.error('No attendance records to export')
        return
      }
      exportStudentAttendanceToExcel(analytics.allRecords, user.name, user.studentId || user.email)
      toast.success('Attendance exported to Excel successfully!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Failed to export to Excel')
    }
  }

  const filteredActivity = analytics?.recentActivity?.filter(activity => {
    const matchesDate = !filterDate || activity.timestamp?.includes(filterDate)
    const matchesClass = !filterClass || activity.className?.toLowerCase().includes(filterClass.toLowerCase())
    const matchesSearch = !searchQuery || 
      activity.className?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDate && matchesClass && matchesSearch
  }) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
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

  const attendancePercentage = analytics.overview.totalClasses > 0
    ? ((analytics.overview.totalAttendance / analytics.overview.totalClasses) * 100).toFixed(1)
    : 0

  const isLowAttendance = attendancePercentage < 75

  return (
    <div className="space-y-6">
      {/* Welcome Header with Today's Status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-indigo-100 mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-indigo-100">Overall Attendance</p>
              <p className="text-4xl font-bold">{attendancePercentage}%</p>
            </div>
            {analytics.todayStatus ? (
              <div className={`px-6 py-3 rounded-lg ${
                analytics.todayStatus.status === 'present' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}>
                {analytics.todayStatus.status === 'present' ? (
                  <>
                    <FaCheckCircle className="text-3xl mx-auto mb-1" />
                    <p className="text-sm font-semibold">Present Today</p>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-3xl mx-auto mb-1" />
                    <p className="text-sm font-semibold">Absent Today</p>
                  </>
                )}
              </div>
            ) : (
              <div className="px-6 py-3 rounded-lg bg-gray-500">
                <FaClock className="text-3xl mx-auto mb-1" />
                <p className="text-sm font-semibold">No Class Today</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Notifications/Alerts Panel */}
      {isLowAttendance && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
        >
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-500 text-xl mt-1 mr-3" />
            <div>
              <h3 className="text-red-800 font-semibold">Low Attendance Alert</h3>
              <p className="text-red-700 text-sm mt-1">
                Your attendance is {attendancePercentage}% which is below the required 75%. Please attend classes regularly.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Classes"
          value={analytics.overview.totalClasses}
          icon={<FaChalkboard />}
          color="blue"
        />
        <StatCard
          title="Classes Attended"
          value={analytics.overview.totalAttendance}
          icon={<FaCheckCircle />}
          color="green"
        />
        <StatCard
          title="Classes Missed"
          value={analytics.overview.totalClasses - analytics.overview.totalAttendance}
          icon={<FaTimesCircle />}
          color="red"
        />
        <StatCard
          title="Current Streak"
          value={`${analytics.overview.currentStreak} days`}
          icon={<FaFire />}
          color="orange"
        />
      </div>

      {/* Today's Attendance Status Card */}
      {analytics.todayStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-indigo-600" />
            Today's Attendance Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(new Date(analytics.todayStatus.timestamp), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Class Name</p>
              <p className="text-lg font-semibold text-gray-900">{analytics.todayStatus.className}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-lg font-semibold ${
                analytics.todayStatus.status === 'present' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.todayStatus.status === 'present' ? 'Present' : 'Absent'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Time Marked</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(new Date(analytics.todayStatus.timestamp), 'hh:mm a')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Attendance Summary Section with Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-indigo-600" />
            Attendance Distribution
          </h2>
          <AttendancePieChart
            data={[
              { name: 'Present', value: analytics.overview.totalAttendance, color: '#10b981' },
              { name: 'Absent', value: analytics.overview.totalClasses - analytics.overview.totalAttendance, color: '#ef4444' }
            ]}
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{attendancePercentage}%</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{(100 - attendancePercentage).toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Monthly Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaCalendarCheck className="mr-2 text-indigo-600" />
            Monthly Attendance
          </h2>
          <AttendanceBarChart data={analytics.monthlyTrend} />
        </motion.div>
      </div>

      {/* Weekly Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-indigo-600" />
          Weekly Attendance Trend
        </h2>
        <AttendanceLineChart data={analytics.weeklyTrend} />
      </motion.div>

      {/* Personal Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaTrophy className="mr-2 text-indigo-600" />
          Personal Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <FaFire className="text-3xl text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Longest Streak</p>
            <p className="text-2xl font-bold text-blue-600">{analytics.overview.longestStreak} days</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <FaCheckCircle className="text-3xl text-green-600 mb-2" />
            <p className="text-sm text-gray-600">This Week</p>
            <p className="text-2xl font-bold text-green-600">{analytics.overview.thisWeek}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <FaCalendarAlt className="text-3xl text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-purple-600">{analytics.overview.thisMonth}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <FaPercent className="text-3xl text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Attendance Rate</p>
            <p className="text-2xl font-bold text-orange-600">{attendancePercentage}%</p>
          </div>
        </div>

        {/* Subject-wise Stats */}
        {analytics.classStats && analytics.classStats.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Subject-wise Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.classStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{stat.className}</p>
                    <FaBook className="text-indigo-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {stat.attended} / {stat.total} classes
                    </p>
                    <p className="text-lg font-bold text-indigo-600">
                      {stat.total > 0 ? ((stat.attended / stat.total) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Attendance History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FaCalendarCheck className="mr-2 text-indigo-600" />
            Attendance History
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm font-semibold"
            >
              <FaDownload className="mr-2" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaFilter className="inline mr-1" />
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaFilter className="inline mr-1" />
              Filter by Class
            </label>
            <input
              type="text"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              placeholder="Enter class name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaSearch className="inline mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class / Lecture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Marked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivity.length > 0 ? (
                filteredActivity.map((activity, index) => {
                  let formattedDate = 'Invalid date'
                  let formattedTime = 'Invalid time'
                  try {
                    if (activity.timestamp) {
                      formattedDate = format(new Date(activity.timestamp), 'MMM dd, yyyy')
                      formattedTime = format(new Date(activity.timestamp), 'hh:mm a')
                    }
                  } catch (error) {
                    formattedDate = 'Invalid date'
                    formattedTime = 'Invalid time'
                  }

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {activity.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formattedTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.teacherName || 'N/A'}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Support / Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaQuestionCircle className="mr-2 text-indigo-600" />
          Support & Help
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowContactTeacher(true)}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left"
          >
            <FaEnvelope className="text-2xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Contact Teacher</h3>
            <p className="text-sm text-gray-600">Get in touch with your teacher</p>
          </button>
          <button 
            onClick={() => setShowReportIssue(true)}
            className="p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-left"
          >
            <FaExclamationTriangle className="text-2xl text-red-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Report Issue</h3>
            <p className="text-sm text-gray-600">Report wrong attendance</p>
          </button>
          <button 
            onClick={() => setShowFAQs(true)}
            className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-left"
          >
            <FaQuestionCircle className="text-2xl text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">FAQs & Guide</h3>
            <p className="text-sm text-gray-600">View help documentation</p>
          </button>
        </div>
      </motion.div>

      {/* Modals */}
      <ContactTeacherModal
        isOpen={showContactTeacher}
        onClose={() => setShowContactTeacher(false)}
        studentId={user.studentId || user.email}
        studentName={user.name}
        organizationId={user.organizationId}
      />
      <ReportIssueModal
        isOpen={showReportIssue}
        onClose={() => setShowReportIssue(false)}
        studentId={user.studentId || user.email}
        studentName={user.name}
        organizationId={user.organizationId}
      />
      <FAQsModal
        isOpen={showFAQs}
        onClose={() => setShowFAQs(false)}
      />
    </div>
  )
}

export default StudentHome
