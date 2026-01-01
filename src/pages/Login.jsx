import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaChalkboardTeacher } from 'react-icons/fa'
import LandingHeader from '../components/commons/LandingHeader'
import Footer from '../components/commons/Footer'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingDashboard, setLoadingDashboard] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Verify email matches Firestore record (in case admin changed it)
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('../config/firebase')
      
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email.toLowerCase())
      )
      const usersSnapshot = await getDocs(usersQuery)
      
      if (usersSnapshot.empty) {
        // User not found in Firestore - might be email mismatch
        await auth.signOut()
        throw new Error('Your email has been updated. Please use your new email to login.')
      }
      
      const userData = usersSnapshot.docs[0].data()
      const authenticatedEmail = userCredential.user.email.toLowerCase()
      const currentEmail = userData.email.toLowerCase()
      
      if (authenticatedEmail !== currentEmail) {
        // Email mismatch - admin changed the email
        await auth.signOut()
        throw new Error('Your email has been updated by admin. Please use your new email to login.')
      }
      
      toast.success('Login successful!')
      // Show loading state while user data is being fetched
      setLoadingDashboard(true)
      // The redirect will happen automatically via App.jsx after user data is loaded
    } catch (error) {
      // Handle authentication failures with clear error messages
      let errorMessage = 'Login failed. Please try again.'
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      setLoading(false)
      setLoadingDashboard(false)
    }
  }

  // Show loading dashboard screen after successful authentication
  if (loadingDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading your dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <LandingHeader />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-100"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4"
            >
              <FaChalkboardTeacher className="text-5xl text-indigo-600" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Staff Login
            </h1>
            <p className="text-gray-600">Admin & Teacher Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-indigo-600" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-indigo-600" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600">
              <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </p>
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                Register Organization
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Are you a student?{' '}
              <Link to="/student-login" className="text-purple-600 font-semibold hover:underline">
                Student Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default Login
