import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { logout } from '../store/slices/authSlice'
import { useRoleLabels } from '../hooks/useRoleLabels'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      dispatch(logout())
      toast.success('Logged out successfully!')
      navigate('/login')
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out. Please try again or refresh the page.')
    }
  }

  const getNavLinks = () => {
    if (user?.role === 'teacher') {
      return [
        { path: '/teacher', label: 'Dashboard' },
        { path: '/teacher/classes', label: `Manage ${labels.classes}` },
        { path: '/teacher/students', label: `Manage ${labels.students}` },
        { path: '/teacher/attendance', label: 'Attendance Session' },
        { path: '/teacher/view-attendance', label: 'View Attendance' },
        { path: '/teacher/queries', label: 'Student Queries' }
      ]
    } else if (user?.role === 'admin') {
      return [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/teachers', label: `Manage ${labels.teachers}` },
        { path: '/admin/classes', label: `Manage ${labels.classes}` },
        { path: '/admin/students', label: `Manage ${labels.students}` },
        { path: '/admin/attendance', label: 'Attendance Session' },
        { path: '/admin/view-attendance', label: 'View Attendance' },
        { path: '/admin/queries', label: 'Queries & Issues' },
        { path: '/admin/settings', label: 'Settings' }
      ]
    } else if (user?.role === 'student') {
      return [
        { path: '/student', label: 'Dashboard' },
        { path: '/student/settings', label: 'Settings' }
      ]
    }
    return []
  }

  const navLinks = getNavLinks()

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">VisionAttend</h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'admin' ? 'Admin' : 
                 user?.role === 'teacher' ? labels.teacher : 
                 user?.role === 'student' ? labels.student : 
                 user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm px-3 py-2"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3 py-3 border-b border-gray-200">
              <div className="bg-indigo-100 p-2 rounded-full">
                <FaUser className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Admin' : 
                   user?.role === 'teacher' ? labels.teacher : 
                   user?.role === 'student' ? labels.student : 
                   user?.role}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 mt-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
