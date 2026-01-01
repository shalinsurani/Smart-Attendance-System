import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { motion } from 'framer-motion'
import { 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaUser, 
  FaIdCard,
  FaGlobe,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const OrganizationSetup = ({ user, organizationId }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Basic Details
    organizationName: '',
    organizationType: 'school',
    officialEmail: '',
    phoneNumber: '',
    
    // Address Details
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    
    // Admin Details
    adminFullName: user?.name || '',
    adminEmail: user?.email || '',
    adminPhone: '',
    designation: 'admin',
    
    // Organization Identifiers
    registrationNumber: '',
    organizationCode: `ORG${Date.now().toString().slice(-6)}`,
    websiteUrl: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.organizationName || !formData.officialEmail || !formData.phoneNumber) {
          toast.error('Please fill all required fields')
          return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
          toast.error('Please enter a valid email address')
          return false
        }
        return true
      case 2:
        if (!formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
          toast.error('Please fill all required address fields')
          return false
        }
        return true
      case 3:
        if (!formData.adminFullName || !formData.adminEmail || !formData.adminPhone) {
          toast.error('Please fill all required admin fields')
          return false
        }
        return true
      case 4:
        return true // Optional fields
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    setLoading(true)

    try {
      // Update organization document with all details
      const orgRef = doc(db, 'organizations', organizationId)
      await updateDoc(orgRef, {
        ...formData,
        setupCompleted: true,
        setupCompletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Update user document
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        organizationSetupCompleted: true
      })

      toast.success('Organization setup completed successfully!')
      
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin')
        window.location.reload() // Reload to update user state
      }, 1000)
    } catch (error) {
      console.error('Error completing setup:', error)
      toast.error('Failed to complete setup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Basic Details', icon: <FaBuilding /> },
    { number: 2, title: 'Address', icon: <FaMapMarkerAlt /> },
    { number: 3, title: 'Admin Details', icon: <FaUser /> },
    { number: 4, title: 'Identifiers', icon: <FaIdCard /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Complete Organization Setup
          </h1>
          <p className="text-gray-600">
            Please provide your organization details to get started
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? <FaCheckCircle /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <p className="text-xs mt-2 text-center">{step.title}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Organization Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBuilding className="inline mr-2 text-indigo-600" />
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type *
                </label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  required
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="office">Office</option>
                  <option value="university">University</option>
                  <option value="institute">Institute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-indigo-600" />
                  Official Email Address *
                </label>
                <input
                  type="email"
                  name="officialEmail"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="organization@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2 text-indigo-600" />
                  Phone Number (Primary Contact) *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Address Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Address & Location Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Street address, building name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Apartment, suite, floor"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="Country"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode / Zipcode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="Pincode"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Admin Details */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Admin / Owner Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-indigo-600" />
                  Admin Full Name *
                </label>
                <input
                  type="text"
                  name="adminFullName"
                  value={formData.adminFullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-indigo-600" />
                  Admin Email *
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2 text-indigo-600" />
                  Admin Phone Number *
                </label>
                <input
                  type="tel"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation *
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="principal">Principal</option>
                  <option value="director">Director</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 4: Organization Identifiers */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Organization Identifiers</h2>
              <p className="text-sm text-gray-600 mb-4">These fields are optional but recommended for professional use</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIdCard className="inline mr-2 text-indigo-600" />
                  Registration Number / GST / CIN (Optional)
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="Registration number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Code (Auto-generated)
                </label>
                <input
                  type="text"
                  name="organizationCode"
                  value={formData.organizationCode}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">This unique code identifies your organization</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGlobe className="inline mr-2 text-indigo-600" />
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="https://www.example.com"
                />
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center"
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Completing Setup...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default OrganizationSetup
