import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAttendanceRecords } from '../../services/attendanceService'
import { getClassesByTeacher, getClassesByOrganization } from '../../services/classService'
import { exportAttendanceToExcel } from '../../services/exportService'
import { useRoleLabels } from '../../hooks/useRoleLabels'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ViewAttendance = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [records, setRecords] = useState([])
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [filteredRecords, setFilteredRecords] = useState([])
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    studentId: '',
  })
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('classes') // 'classes' or 'records'

  useEffect(() => {
    loadData()
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [filters, records, selectedClass])

  const loadData = async () => {
    try {
      console.log('Loading data for:', {
        userId: user.uid,
        role: user.role,
        organizationId: user.organizationId
      })
      
      // Load classes - Admin sees all, teacher sees only their own
      const classesData = user.role === 'admin'
        ? await getClassesByOrganization(user.organizationId)
        : await getClassesByTeacher(user.uid, user.organizationId)
      setClasses(classesData)
      
      // Load all attendance records
      const attendanceParams = user.role === 'admin'
        ? { organizationId: user.organizationId }
        : { teacherId: user.uid, organizationId: user.organizationId }
      
      const attendanceData = await getAttendanceRecords(attendanceParams)
      
      console.log('Loaded:', classesData.length, 'classes,', attendanceData.length, 'records')
      
      setRecords(attendanceData)
      
      if (attendanceData.length > 0) {
        toast.success(`Loaded ${attendanceData.length} attendance records`)
      }
    } catch (error) {
      console.error('Data loading error:', error)
      toast.error(`Failed to load data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...records]

    // Filter by selected class
    if (selectedClass) {
      filtered = filtered.filter(r => r.classId === selectedClass.id)
    }

    if (filters.startDate) {
      filtered = filtered.filter(r => 
        new Date(r.timestamp) >= new Date(filters.startDate)
      )
    }

    if (filters.endDate) {
      filtered = filtered.filter(r => 
        new Date(r.timestamp) <= new Date(filters.endDate)
      )
    }

    if (filters.studentId) {
      filtered = filtered.filter(r => 
        r.studentId.toLowerCase().includes(filters.studentId.toLowerCase())
      )
    }

    setFilteredRecords(filtered)
  }

  const getClassStats = (classId) => {
    const classRecords = records.filter(r => r.classId === classId)
    const uniqueStudents = new Set(classRecords.map(r => r.studentId))
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayRecords = classRecords.filter(r => {
      const recordDate = new Date(r.timestamp)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === today.getTime()
    })
    
    return {
      totalRecords: classRecords.length,
      uniqueStudents: uniqueStudents.size,
      todayPresent: new Set(todayRecords.map(r => r.studentId)).size,
      lastAttendance: classRecords.length > 0 ? classRecords[0].timestamp : null
    }
  }

  const handleClassClick = (classData) => {
    setSelectedClass(classData)
    setView('records')
  }

  const handleBackToClasses = () => {
    setSelectedClass(null)
    setView('classes')
    setFilters({ startDate: '', endDate: '', studentId: '' })
  }

  const handleExport = () => {
    try {
      const dataToExport = view === 'records' ? filteredRecords : records
      exportAttendanceToExcel(dataToExport, labels.orgType)
      toast.success('Attendance exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export attendance. Please try again or contact support.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  // Classes View
  if (view === 'classes') {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">View Attendance</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setLoading(true)
                loadData()
              }} 
              className="btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              Refresh
            </button>
            <button onClick={handleExport} className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-2">
              Export All
            </button>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Select {labels.class} to View Attendance</h2>
          <p className="text-gray-600 mb-4">Click on a {labels.class.toLowerCase()} to see detailed attendance records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData) => {
            const stats = getClassStats(classData.id)
            return (
              <div
                key={classData.id}
                onClick={() => handleClassClick(classData)}
                className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{classData.name}</h3>
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                    {stats.totalRecords} records
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total {labels.students}:</span>
                    <span className="font-semibold text-gray-900">{stats.uniqueStudents}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Present Today:</span>
                    <span className="font-semibold text-green-600">{stats.todayPresent}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Attendance:</span>
                    <span className="text-sm text-gray-500">
                      {stats.lastAttendance 
                        ? format(new Date(stats.lastAttendance), 'MMM dd, yyyy')
                        : 'No records'
                      }
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-primary hover:underline text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No {labels.classes.toLowerCase()} found</p>
            <p className="text-sm">Create a {labels.class.toLowerCase()} to start tracking attendance</p>
          </div>
        )}
      </div>
    )
  }

  // Records View (for selected class)
  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <button onClick={handleBackToClasses} className="text-primary hover:underline text-left">
              ← Back to {labels.classes}
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedClass?.name}</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setLoading(true)
                loadData()
              }} 
              className="btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              Refresh
            </button>
            <button onClick={handleExport} className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-2">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{labels.studentId}</label>
            <input
              type="text"
              value={filters.studentId}
              onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
              className="input-field"
              placeholder="Search by ID"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Attendance Records ({filteredRecords.length})</h2>
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No attendance records found</p>
            <p className="text-sm">Start an attendance session to mark students present</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{labels.studentId}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{record.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(record.timestamp), 'yyyy-MM-dd')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(record.timestamp), 'HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewAttendance
