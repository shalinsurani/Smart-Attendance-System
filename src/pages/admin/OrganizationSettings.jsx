import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { setOrganization } from '../../store/slices/organizationSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaUser, 
  FaIdCard,
  FaGlobe
} from 'react-icons/fa'

const OrganizationSettings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { organization } = useSelector((state) => state.organization)
  
  const [isEditing, setIsEditing] = useState(false)
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
    adminFullName: '',
    adminEmail: '',
    adminPhone: '',
    designation: 'admin',
    
    // Organization Identifiers
    registrationNumber: '',
    organizationCode: '',
    websiteUrl: ''
  })

  useEffect(() => {
    if (organization) {
      setFormData({
        organizationName: organization.organizationName || organization.name || '',
        organizationType: organization.organizationType || organization.type || 'school',
        officialEmail: organization.officialEmail || '',
        phoneNumber: organization.phoneNumber || '',
        addressLine1: organization.addressLine1 || '',
        addressLine2: organization.addressLine2 || '',
        city: organization.city || '',
        state: organization.state || '',
        country: organization.country || 'India',
        pincode: organization.pincode || '',
        adminFullName: organization.adminFullName || user?.name || '',
        adminEmail: organization.adminEmail || user?.email || '',
        adminPhone: organization.adminPhone || '',
        designation: organization.designation || 'admin',
        registrationNumber: organization.registrationNumber || '',
        organizationCode: organization.organizationCode || '',
        websiteUrl: organization.websiteUrl || ''
      })
    }
  }, [organization, user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
    if (organization) {
      setFormData({
        organizationName: organization.organizationName || organization.name || '',
        organizationType: organization.organizationType || organization.type || 'school',
        officialEmail: organization.officialEmail || '',
        phoneNumber: organization.phoneNumber || '',
        addressLine1: organization.addressLine1 || '',
        addressLine2: organization.addressLine2 || '',
        city: organization.city || '',
        state: organization.state || '',
        country: organization.country || 'India',
        pincode: organization.pincode || '',
        adminFullName: organization.adminFullName || user?.name || '',
        adminEmail: organization.adminEmail || user?.email || '',
        adminPhone: organization.adminPhone || '',
        designation: organization.designation || 'admin',
        registrationNumber: organization.registrationNumber || '',
        organizationCode: organization.organizationCode || '',
        websiteUrl: organization.websiteUrl || ''
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.organizationName || !formData.officialEmail || !formData.phoneNumber) {
        toast.error('Please fill all required fields')
        return
      }

      // Update organization document
      const orgRef = doc(db, 'organizations', organization.id)
      await updateDoc(orgRef, {
        ...formData,
        // Keep backward compatibility
        name: formData.organizationName,
        type: formData.organizationType,
        updatedAt: new Date().toISOString()
      })

      // Update Redux store
      dispatch(setOrganization({
        ...organization,
        ...formData,
        name: formData.organizationName,
        type: formData.organizationType
      }))

      toast.success('Organization settings updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating organization:', error)
      toast.error('Failed to update settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
          <p className="text-gray-600 mt-1">Manage your organization details and information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center"
          >
            <FaEdit className="mr-2" />
            Edit Settings
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center disabled:opacity-50"
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
          </div>
        )}
      </div>

      {/* Basic Organization Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaBuilding className="mr-2 text-indigo-600" />
          Basic Organization Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
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
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
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
              Official Email *
            </label>
            <input
              type="email"
              name="officialEmail"
              value={formData.officialEmail}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-indigo-600" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
              required
            />
          </div>
        </div>
      </motion.div>

      {/* Address Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-indigo-600" />
          Address & Location Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
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
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
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
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Admin Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaUser className="mr-2 text-indigo-600" />
          Admin / Owner Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Full Name *
            </label>
            <input
              type="text"
              name="adminFullName"
              value={formData.adminFullName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email *
            </label>
            <input
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-indigo-600" />
              Admin Phone *
            </label>
            <input
              type="tel"
              name="adminPhone"
              value={formData.adminPhone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
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
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <option value="admin">Admin</option>
              <option value="principal">Principal</option>
              <option value="director">Director</option>
              <option value="hr_manager">HR Manager</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Organization Identifiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaIdCard className="mr-2 text-indigo-600" />
          Organization Identifiers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number / GST / CIN
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Code
            </label>
            <input
              type="text"
              name="organizationCode"
              value={formData.organizationCode}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">This code cannot be changed</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaGlobe className="inline mr-2 text-indigo-600" />
              Website URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none ${
                isEditing
                  ? 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="https://www.example.com"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrganizationSettings
