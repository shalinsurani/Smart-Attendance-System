import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaUserGraduate, FaEnvelope, FaLock, FaCalendar, FaIdCard } from 'react-icons/fa'
import LandingHeader from '../components/commons/LandingHeader'
import Footer from '../components/commons/Footer'

const StudentLogin = () => {
  const [step, setStep] = useState(1) // 1: Email, 2: Verification
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationData, setVerificationData] = useState({
    dateOfBirth: '',
    grNumber: ''
  })
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDashboard, setLoadingDashboard] = useState(false)
  const navigate = useNavigate()

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, find student document by email
      const studentsRef = collection(db, 'students')
      const q = query(studentsRef, where('email', '==', email.toLowerCase()))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        throw new Error('Student not found. Please contact your teacher.')
      }

      const studentDoc = snapshot.docs[0]
      const student = { id: studentDoc.id, ...studentDoc.data() }
      
      // Prepare padded enrollment number for comparison
      let enrollmentNumber = student.rollNumber || ''
      let paddedEnrollment = enrollmentNumber.length < 6 ? enrollmentNumber.padEnd(6, '0') : enrollmentNumber
      
      // Check if password matches enrollment number or padded version (first-time login)
      if (password === enrollmentNumber || password === paddedEnrollment) {
        // First time login - require verification
        setStudentData(student)
        setStep(2)
        toast.success('Please verify your details for first-time login')
        setLoading(false)
        return
      }
      
      // Try to sign in with Firebase Auth
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        
        // IMPORTANT: Verify that the authenticated email matches the current Firestore email
        // This prevents login with old email after admin changes it
        const authenticatedEmail = userCredential.user.email.toLowerCase()
        const currentEmail = student.email.toLowerCase()
        
        if (authenticatedEmail !== currentEmail) {
          // Email mismatch - admin changed the email
          // Sign out immediately
          await auth.signOut()
          throw new Error('Your email has been updated by admin. Please use your new email to login.')
        }
        
        // Regular login successful - proceed to dashboard
        setLoadingDashboard(true)
        toast.success('Login successful!')
      } catch (authError) {
        // If auth fails, it might be because account doesn't exist yet
        if (authError.code === 'auth/user-not-found') {
          throw new Error('Invalid password. Use your enrollment number for first login.')
        } else if (authError.code === 'auth/wrong-password') {
          throw new Error('Incorrect password. Use your enrollment number for first login.')
        } else {
          throw authError
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Verify date of birth and GR number
      if (verificationData.dateOfBirth !== studentData.dateOfBirth) {
        throw new Error('Date of birth does not match our records')
      }
      
      if (verificationData.grNumber !== studentData.studentId) {
        throw new Error('GR Number does not match our records')
      }

      // Verification successful - Create Firebase Auth account
      toast.success('Verification successful! Creating your account...')
      
      try {
        // Create Firebase Auth account with enrollment number as initial password
        // Ensure password is at least 6 characters (Firebase requirement)
        let initialPassword = studentData.rollNumber || 'student123'
        if (initialPassword.length < 6) {
          // Pad with zeros to make it 6 characters
          initialPassword = initialPassword.padEnd(6, '0')
        }
        
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          studentData.email,
          initialPassword
        )
        
        // Create user document in users collection
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: studentData.email,
          name: studentData.name,
          role: 'student',
          studentId: studentData.studentId,
          organizationId: studentData.organizationId,
          createdAt: new Date().toISOString()
        })
        
        // Update student document to mark auth as created
        await updateDoc(doc(db, 'students', studentData.id), {
          authCreated: true,
          authUid: userCredential.user.uid
        })
        
        toast.success('Account created! Redirecting to dashboard...')
        setLoadingDashboard(true)
        
        // Redirect will happen automatically via App.jsx
        setTimeout(() => {
          navigate('/student')
        }, 1500)
      } catch (authError) {
        console.error('Auth creation error:', authError)
        
        if (authError.code === 'auth/email-already-in-use') {
          // Account already exists, try to sign in
          let initialPassword = studentData.rollNumber || 'student123'
          if (initialPassword.length < 6) {
            initialPassword = initialPassword.padEnd(6, '0')
          }
          await signInWithEmailAndPassword(auth, studentData.email, initialPassword)
          toast.success('Login successful! Redirecting to dashboard...')
          setLoadingDashboard(true)
          setTimeout(() => {
            navigate('/student')
          }, 1500)
        } else if (authError.code === 'auth/weak-password') {
          throw new Error('Enrollment number is too short. Please contact your teacher to update it.')
        } else {
          throw new Error('Failed to create account. Please contact your teacher.')
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error(error.message || 'Verification failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep(1)
    setVerificationData({ dateOfBirth: '', grNumber: '' })
  }

  // Show loading dashboard screen
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
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-100"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4"
            >
              <FaUserGraduate className="text-5xl text-purple-600" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Student Portal
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Access Your Attendance Dashboard</p>
          </div>

        {step === 1 ? (
          // Step 1: Email and Password
          <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2" />
                Password / Enrollment Number
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your enrollment number for first login"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                First time? Use your enrollment number as password
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                'Login to Portal'
              )}
            </motion.button>
          </form>
        ) : (
          // Step 2: Verification for First-Time Login
          <form onSubmit={handleVerification} className="space-y-4 sm:space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-indigo-800">
                <strong>First-Time Login Verification</strong>
                <br />
                Please verify your details to complete the login process.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2" />
                Date of Birth
              </label>
              <input
                type="date"
                value={verificationData.dateOfBirth}
                onChange={(e) => setVerificationData({ ...verificationData, dateOfBirth: e.target.value })}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaIdCard className="inline mr-2" />
                GR Number / Student ID
              </label>
              <input
                type="text"
                value={verificationData.grNumber}
                onChange={(e) => setVerificationData({ ...verificationData, grNumber: e.target.value })}
                className="input-field"
                placeholder="Enter your GR Number"
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={loading}
                className="flex-1 btn-secondary py-3 text-sm sm:text-base"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg text-sm sm:text-base font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </motion.button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            <Link to="/forgot-password" className="text-purple-600 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Not a student?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Staff Login
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Need help? Contact your teacher or administrator
          </p>
        </div>
      </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default StudentLogin
