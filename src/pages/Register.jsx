import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'
import { createOrganization } from '../services/organizationService'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaBuilding, FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa'
import LandingHeader from '../components/commons/LandingHeader'
import Footer from '../components/commons/Footer'

const Register = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'school',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // Set a flag to prevent App.jsx from trying to load user data during registration
      window.isRegistering = true
      
      // Step 1: Create Firebase authentication account
      console.log('Step 1: Creating Firebase Auth account...')
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      if (!userCredential.user) {
        throw new Error('Failed to create user account')
      }
      
      console.log('✅ Firebase Auth account created:', userCredential.user.uid)

      // Step 2: Create organization document with type
      // Step 3: Create admin user document
      console.log('Step 2: Creating organization and user documents...')
      const orgId = await createOrganization({
        uid: userCredential.user.uid,
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        adminName: formData.adminName,
        email: formData.email,
      })

      if (!orgId) {
        throw new Error('Failed to create organization')
      }
      
      console.log('✅ Organization created:', orgId)

      // Step 4: Success - user is automatically logged in by Firebase
      toast.success('Organization registered successfully!')
      
      // Step 5: Wait a moment for Firestore to sync
      console.log('Waiting for Firestore to sync...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear the registration flag
      window.isRegistering = false
      
      // Step 6: Force reload to trigger auth state change with complete data
      console.log('Reloading to complete login...')
      window.location.href = '/admin'
    } catch (error) {
      window.isRegistering = false
      console.error('Registration error:', error)
      
      // Provide specific error messages
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already registered. Please login instead.')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address')
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Use at least 6 characters.')
      } else if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check Firestore rules.')
      } else {
        toast.error(error.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
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
              <FaBuilding className="text-5xl text-indigo-600" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Get Started
            </h1>
            <p className="text-gray-600">Register Your Organization</p>
          </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              Please wait while we set up your organization...
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBuilding className="inline mr-2 text-indigo-600" />
              Organization Name
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="Enter organization name"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCheckCircle className="inline mr-2 text-indigo-600" />
              Organization Type
            </label>
            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              disabled={loading}
              required
            >
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="office">Office</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-indigo-600" />
              Admin Name
            </label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="Enter your name"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-indigo-600" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="your.email@example.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline mr-2 text-indigo-600" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="Enter password (min 6 characters)"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline mr-2 text-indigo-600" />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              placeholder="Confirm password"
              disabled={loading}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating your organization...
              </span>
            ) : (
              'Create Organization'
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
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

export default Register
