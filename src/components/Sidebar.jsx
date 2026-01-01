import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { useRoleLabels } from '../hooks/useRoleLabels'
import { 
  FaHome, 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaUsers, 
  FaCalendarCheck, 
  FaChartBar, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaEnvelope,
  FaBook
} from 'react-icons/fa'

const Sidebar = ({ onCollapseChange }) => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed)
    }
  }, [isCollapsed, onCollapseChange])

  const getNavLinks = () => {
    if (user?.role === 'teacher') {
      return [
        { path: '/teacher', label: 'Dashboard', icon: <FaHome /> },
        { path: '/teacher/classes', label: `Manage ${labels.classes}`, icon: <FaBook /> },
        { path: '/teacher/students', label: `Manage ${labels.students}`, icon: <FaUserGraduate /> },
        { path: '/teacher/attendance', label: 'Attendance Session', icon: <FaCalendarCheck /> },
        { path: '/teacher/view-attendance', label: 'View Attendance', icon: <FaChartBar /> },
        { path: '/teacher/queries', label: 'Student Queries', icon: <FaEnvelope /> }
      ]
    } else if (user?.role === 'admin') {
      return [
        { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
        { path: '/admin/teachers', label: `Manage ${labels.teachers}`, icon: <FaChalkboardTeacher /> },
        { path: '/admin/classes', label: `Manage ${labels.classes}`, icon: <FaBook /> },
        { path: '/admin/students', label: `Manage ${labels.students}`, icon: <FaUserGraduate /> },
        { path: '/admin/attendance', label: 'Attendance Session', icon: <FaCalendarCheck /> },
        { path: '/admin/view-attendance', label: 'View Attendance', icon: <FaChartBar /> },
        { path: '/admin/queries', label: 'Queries & Issues', icon: <FaEnvelope /> },
        { path: '/admin/settings', label: 'Settings', icon: <FaCog /> }
      ]
    } else if (user?.role === 'student') {
      return [
        { path: '/student', label: 'Dashboard', icon: <FaHome /> },
        { path: '/student/settings', label: 'Settings', icon: <FaCog /> }
      ]
    }
    return []
  }

  const navLinks = getNavLinks()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-2xl z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              VisionAttend
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <FaBars size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-indigo-300 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`}
                    title={isCollapsed ? link.label : ''}
                  >
                    <span className="text-xl flex-shrink-0">{link.icon}</span>
                    {!isCollapsed && (
                      <span className="text-sm font-medium truncate">{link.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-indigo-700">
            <p className="text-xs text-indigo-300 text-center">
              &copy; 2025 VisionAttend
            </p>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
