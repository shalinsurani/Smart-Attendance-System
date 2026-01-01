import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaEnvelope, FaCheckCircle, FaClock, FaReply } from 'react-icons/fa'
import { getTeacherQueries, updateQueryStatus } from '../../services/queryService'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ManageQueries = () => {
  const { user } = useSelector((state) => state.auth)
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, solved
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [response, setResponse] = useState('')

  useEffect(() => {
    loadQueries()
  }, [user])

  const loadQueries = async () => {
    try {
      const data = await getTeacherQueries(user.uid, user.organizationId)
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
    if (filter === 'all') return true
    return q.status === filter
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Queries</h1>
          <p className="text-gray-600 mt-1">Manage messages from students</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({queries.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({queries.filter(q => q.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('solved')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'solved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Solved ({queries.filter(q => q.status === 'solved').length})
          </button>
        </div>
      </div>

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
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
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
                  <p className="text-xs text-gray-500">
                    {format(new Date(query.createdAt), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{query.message}</p>
              </div>

              {query.response && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Your Response:</p>
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
