import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaEnvelope, FaCheckCircle, FaClock, FaExclamationTriangle, FaReply } from 'react-icons/fa'
import { getAdminQueries, updateQueryStatus } from '../../services/queryService'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ManageQueries = () => {
  const { user } = useSelector((state) => state.auth)
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, solved
  const [typeFilter, setTypeFilter] = useState('all') // all, contact_teacher, report_issue
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [response, setResponse] = useState('')

  useEffect(() => {
    loadQueries()
  }, [user])

  const loadQueries = async () => {
    try {
      const data = await getAdminQueries(user.organizationId)
      setQueries(data)
    } catch (error) {
      console.error('Error loading queries:', error)
      toast.error('Failed to load queries')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (queryId, status) => {
    try {
      await updateQueryStatus(queryId, status, response)
      toast.success(`Query marked as ${status}`)
      setResponse('')
      setSelectedQuery(null)
      loadQueries()
    } catch (error) {
      console.error('Error updating query:', error)
      toast.error('Failed to update query')
    }
  }

  const filteredQueries = queries.filter(q => {
    const matchesStatus = filter === 'all' || q.status === filter
    const matchesType = typeFilter === 'all' || q.type === typeFilter
    return matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Queries & Issues</h1>
        <p className="text-gray-600 mt-1">Monitor and manage all student queries and reported issues</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('solved')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'solved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Solved
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('contact_teacher')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  typeFilter === 'contact_teacher'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Teacher Queries
              </button>
              <button
                onClick={() => setTypeFilter('report_issue')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  typeFilter === 'report_issue'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Reported Issues
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Queries</p>
          <p className="text-2xl font-bold text-indigo-600">{queries.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {queries.filter(q => q.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Teacher Queries</p>
          <p className="text-2xl font-bold text-blue-600">
            {queries.filter(q => q.type === 'contact_teacher').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Reported Issues</p>
          <p className="text-2xl font-bold text-red-600">
            {queries.filter(q => q.type === 'report_issue').length}
          </p>
        </div>
      </div>

      {/* Queries List */}
      {filteredQueries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No queries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQueries.map((query) => (
            <motion.div
              key={query.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 ${
                query.type === 'report_issue' ? 'border-red-500' : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {query.type === 'report_issue' ? (
                      <FaExclamationTriangle className="text-red-600 text-xl" />
                    ) : (
                      <FaEnvelope className="text-blue-600 text-xl" />
                    )}
                    <h3 className="text-lg font-bold text-gray-900">{query.topic}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      query.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {query.status === 'pending' ? (
                        <><FaClock className="inline mr-1" />Pending</>
                      ) : (
                        <><FaCheckCircle className="inline mr-1" />Solved</>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    From: <strong>{query.studentName}</strong> ({query.studentId})
                  </p>
                  {query.type === 'contact_teacher' && query.teacherName && (
                    <p className="text-sm text-gray-600">
                      To: <strong>{query.teacherName}</strong>
                    </p>
                  )}
                  {query.type === 'report_issue' && query.issueType && (
                    <p className="text-sm text-gray-600">
                      Issue Type: <strong className="text-red-600">{query.issueType.replace('_', ' ')}</strong>
                    </p>
                  )}
                  {query.date && (
                    <p className="text-sm text-gray-600">
                      Related Date: <strong>{query.date}</strong>
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Created: {format(new Date(query.createdAt), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{query.message || query.description}</p>
              </div>

              {query.response && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Response:</p>
                  <p className="text-blue-800">{query.response}</p>
                </div>
              )}

              {selectedQuery === query.id ? (
                <div className="space-y-3">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    rows="3"
                    placeholder="Type your response..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(query.id, 'solved')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <FaCheckCircle className="inline mr-2" />
                      Mark as Solved
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuery(null)
                        setResponse('')
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {query.status === 'pending' && (
                    <button
                      onClick={() => setSelectedQuery(query.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      <FaReply className="inline mr-2" />
                      Respond
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageQueries
