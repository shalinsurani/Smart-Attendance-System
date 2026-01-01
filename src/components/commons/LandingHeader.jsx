import { Link } from 'react-router-dom'

const LandingHeader = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              VisionAttend
            </span>
          </Link>
          <div className="flex gap-2 sm:gap-4">
            <Link to="/student-login" className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-indigo-600 transition-colors">
              Student
            </Link>
            <Link to="/login" className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-indigo-600 transition-colors">
              Staff
            </Link>
            <Link to="/register" className="px-4 sm:px-6 py-2 text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default LandingHeader
