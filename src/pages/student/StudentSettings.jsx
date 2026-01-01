import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../../config/firebase'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCalendar, FaIdCard, FaSave, FaCamera, FaCheckCircle } from 'react-icons/fa'
import FaceCapture from '../../components/FaceCapture'
import toast from 'react-hot-toast'
import { useRoleLabels } from '../../hooks/useRoleLabels'

const StudentSettings = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [studentData, setStudentData] = useState(null)
  const [showFaceCapture, setShowFaceCapture] = useState(false)
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    parentGuardianName: '',
    parentContactNumber: ''
  })

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadStudentData()
  }, [user])

  const loadStudentData = async () => {
    try {
      // Find student document
      const studentsRef = collection(db, 'students')
      const q = query(studentsRef, where('studentId', '==', user.studentId))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const studentDoc = snapshot.docs[0]
        const data = { id: studentDoc.id, ...studentDoc.data() }
        setStudentData(data)
        
        setProfileForm({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          parentGuardianName: data.parentGuardianName || '',
          parentContactNumber: data.parentContactNumber || ''
        })
      }
    } catch (error) {
      console.error('Error loading student data:', error)
      toast.error('Failed to load student data')
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!studentData) {
        throw new Error('Student data not found')
      }

      // Update student document in Firestore
      const studentRef = doc(db, 'students', studentData.id)
      await updateDoc(studentRef, {
        name: profileForm.name,
        phoneNumber: profileForm.phoneNumber,
        parentGuardianName: profileForm.parentGuardianName,
        parentContactNumber: profileForm.parentContactNumber,
        updatedAt: new Date().toISOString()
      })

      toast.success('Profile updated successfully!')
      loadStudentData() // Reload data
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate passwords
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // Try to re-authenticate with the provided current password
      let credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordForm.currentPassword
      )
      
      try {
        await reauthenticateWithCredential(auth.currentUser, credential)
      } catch (authError) {
        // If authentication fails, try with padded enrollment number
        if (authError.code === 'auth/invalid-credential' || authError.code === 'auth/wrong-password') {
          // Try with padded enrollment number (initial password)
          if (studentData?.rollNumber) {
            let paddedPassword = studentData.rollNumber.length < 6 
              ? studentData.rollNumber.padEnd(6, '0') 
              : studentData.rollNumber
            
            // Check if user entered the enrollment number
            if (passwordForm.currentPassword === studentData.rollNumber || 
                passwordForm.currentPassword === paddedPassword) {
              credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                paddedPassword
              )
              await reauthenticateWithCredential(auth.currentUser, credential)
            } else {
              throw new Error('Current password is incorrect. If you haven\'t changed your password yet, use your enrollment number.')
            }
          } else {
            throw new Error('Current password is incorrect')
          }
        } else {
          throw authError
        }
      }

      // Update password
      await updatePassword(auth.currentUser, passwordForm.newPassword)

      toast.success('Password changed successfully!')
      
      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error changing password:', error)
      
      let errorMessage = 'Failed to change password'
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Current password is incorrect. If you haven\'t changed your password yet, use your enrollment number.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.'
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log in again before changing your password'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFaceCapture = async (faceDescriptor) => {
    setLoading(true)
    try {
      // Update student document with face descriptor
      const studentRef = doc(db, 'students', studentData.id)
      await updateDoc(studentRef, {
        faceDescriptor: faceDescriptor,
        faceRegistered: true,
        faceRegisteredAt: new Date().toISOString()
      })

      toast.success('Face registered successfully!')
      setShowFaceCapture(false)
      
      // Reload student data
      await loadStudentData()
    } catch (error) {
      console.error('Error saving face data:', error)
      toast.error('Failed to register face. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!studentData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your profile and account settings
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUser className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaLock className="inline mr-2" />
              Password
            </button>
            <button
              onClick={() => setActiveTab('face')}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap ${
                activeTab === 'face'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCamera className="inline mr-2" />
              Face Registration
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'profile' ? (
            // Profile Tab
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                {/* Read-only fields */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Account Information (Read-only)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaIdCard className="inline mr-2" />
                        Student ID / GR Number
                      </label>
                      <input
                        type="text"
                        value={studentData.studentId}
                        disabled
                        className="input-field bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaIdCard className="inline mr-2" />
                        Roll Number
                      </label>
                      <input
                        type="text"
                        value={studentData.rollNumber || 'N/A'}
                        disabled
                        className="input-field bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendar className="inline mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="text"
                        value={studentData.dateOfBirth || 'N/A'}
                        disabled
                        className="input-field bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <input
                        type="text"
                        value={studentData.gender || 'N/A'}
                        disabled
                        className="input-field bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Editable fields */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Editable Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        Email (Read-only)
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="input-field bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Contact admin to change email
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                        className="input-field"
                        placeholder="+1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.parentGuardianName}
                        onChange={(e) => setProfileForm({ ...profileForm, parentGuardianName: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="inline mr-2" />
                        Parent Contact Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.parentContactNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, parentContactNumber: e.target.value })}
                        className="input-field"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto btn-primary px-6 py-3 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : activeTab === 'password' ? (
            // Password Tab
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-6 max-w-md">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Password Requirements:</strong>
                    <br />
                    • Minimum 6 characters
                    <br />
                    • Use a strong, unique password
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>First time changing password?</strong>
                    <br />
                    Your initial password is your enrollment number: <strong>{studentData?.rollNumber || 'N/A'}</strong>
                    {studentData?.rollNumber && studentData.rollNumber.length < 6 && (
                      <span> (padded to 6 characters: <strong>{studentData.rollNumber.padEnd(6, '0')}</strong>)</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="input-field"
                    placeholder="Enter current password or enrollment number"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If you haven't changed your password yet, use your enrollment number
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2" />
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="input-field"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLock className="inline mr-2" />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="input-field"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary px-6 py-3 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : activeTab === 'face' ? (
            // Face Registration Tab
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Face Registration Instructions:</strong>
                    <br />
                    • Ensure you are in a well-lit area
                    <br />
                    • Look directly at the camera
                    <br />
                    • Remove glasses or masks if possible
                    <br />
                    • Keep your face centered in the frame
                  </p>
                </div>

                {(studentData.faceRegistered || studentData.faceDescriptor) ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      Face Already Registered
                    </h3>
                    <p className="text-green-700 mb-4">
                      {studentData.faceRegisteredAt ? (
                        <>
                          Your face was registered on{' '}
                          {new Date(studentData.faceRegisteredAt).toLocaleDateString()}
                        </>
                      ) : (
                        'Your face has been registered by your teacher'
                      )}
                    </p>
                    <p className="text-sm text-green-600 mb-4">
                      You can update your face photo if needed (this will replace the existing data)
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowFaceCapture(true)}
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        <FaCamera className="inline mr-2" />
                        Update Face Photo
                      </button>
                      {/* <button
                        onClick={() => setShowFaceCapture(true)}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        <FaCamera className="inline mr-2" />
                        Re-take Photo
                      </button> */}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <FaCamera className="text-6xl text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-yellow-900 mb-2">
                      Face Not Registered
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      You need to register your face to use the attendance system
                    </p>
                    <button
                      onClick={() => setShowFaceCapture(true)}
                      disabled={loading}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      <FaCamera className="inline mr-2" />
                      Register Face Now
                    </button>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Why register your face?</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Quick and contactless attendance marking</li>
                    <li>• Secure and accurate identification</li>
                    <li>• No need for manual roll calls</li>
                    <li>• Real-time attendance tracking</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Face Capture Modal */}
      {showFaceCapture && (
        <FaceCapture
          onCapture={handleFaceCapture}
          onCancel={() => setShowFaceCapture(false)}
        />
      )}
    </div>
  )
}

export default StudentSettings
