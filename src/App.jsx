import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './config/firebase'
import { setUser, setLoading } from './store/slices/authSlice'
import { getUserData } from './services/userService'
import { getOrganizationData } from './services/organizationService'
import { setOrganization } from './store/slices/organizationSlice'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentLogin from './pages/StudentLogin'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import OrganizationSetup from './pages/OrganizationSetup'
import AdminDashboard from './pages/admin/AdminDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import LoadingScreen from './components/LoadingScreen'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)
  const [retryCount, setRetryCount] = useState(0)

  // Helper function to retry failed operations
  const retryOperation = async (operation, maxRetries = 2) => {
    let lastError
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        console.error(`Attempt ${i + 1} failed:`, error)
        
        // Only retry on network errors
        if (error.message?.includes('Network error') && i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
          continue
        }
        throw error
      }
    }
    throw lastError
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Skip loading user data if we're in the middle of registration
        if (window.isRegistering) {
          console.log('Skipping user data load during registration...')
          dispatch(setLoading(false))
          return
        }
        
        try {
          // Fetch user data from Firestore with retry
          const userData = await retryOperation(async () => {
            const data = await getUserData(firebaseUser.uid)
            if (!data) {
              throw new Error('User profile not found. Please contact support.')
            }
            return data
          })

          // Validate user role
          if (!userData.role || !['admin', 'teacher', 'student'].includes(userData.role)) {
            throw new Error('Invalid user role. Please contact support.')
          }

          // Fetch organization data with retry
          if (!userData.organizationId) {
            throw new Error('Organization not found. Please contact support.')
          }

          const orgData = await retryOperation(async () => {
            const data = await getOrganizationData(userData.organizationId)
            if (!data) {
              throw new Error('Organization not found. Please contact support.')
            }
            return data
          })

          // Set user and organization data in Redux
          dispatch(setUser(userData))
          dispatch(setOrganization(orgData))
          setRetryCount(0) // Reset retry count on success
          
        } catch (error) {
          console.error('Error loading user data:', error)
          
          // Provide specific error messages with retry option for network errors
          if (error.message?.includes('Network error')) {
            toast.error(
              (t) => (
                <div>
                  <p>{error.message}</p>
                  <button
                    onClick={() => {
                      toast.dismiss(t.id)
                      setRetryCount(prev => prev + 1)
                      window.location.reload()
                    }}
                    className="mt-2 text-sm underline"
                  >
                    Retry
                  </button>
                </div>
              ),
              { duration: 5000 }
            )
          } else {
            toast.error(error.message || 'Failed to load user data. Please try again.')
          }
          
          // Sign out user if data fetch fails (except for network errors)
          if (!error.message?.includes('Network error')) {
            await signOut(auth)
          }
          dispatch(setUser(null))
          dispatch(setOrganization(null))
        }
      } else {
        // User is signed out
        dispatch(setUser(null))
        dispatch(setOrganization(null))
      }
      
      dispatch(setLoading(false))
    })

    return () => unsubscribe()
  }, [dispatch, retryCount])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/student-login" element={!user ? <StudentLogin /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to={`/${user.role}`} />} />
        
        <Route path="/organization-setup" element={
          user && user.role === 'admin' ? (
            <OrganizationSetup user={user} organizationId={user.organizationId} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/*" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/student/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
