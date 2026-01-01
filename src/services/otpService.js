import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, isEmailJSConfigured } from '../config/emailjs'

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store OTP in Firestore with expiration time
 */
export const storeOTP = async (email, otp) => {
  try {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    
    console.log('📝 Storing OTP for:', email)
    
    // Delete any existing OTPs for this email (non-blocking)
    try {
      await deleteExistingOTPs(email)
    } catch (deleteError) {
      console.warn('Could not delete existing OTPs, continuing anyway:', deleteError)
    }
    
    // Store new OTP
    const docRef = await addDoc(collection(db, 'otps'), {
      email: email.toLowerCase(),
      otp,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
      verified: false
    })
    
    console.log('✅ OTP stored successfully with ID:', docRef.id)
    return true
  } catch (error) {
    console.error('❌ Error storing OTP:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    throw error
  }
}

/**
 * Delete existing OTPs for an email
 */
export const deleteExistingOTPs = async (email) => {
  try {
    const q = query(
      collection(db, 'otps'),
      where('email', '==', email.toLowerCase())
    )
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      console.log('No existing OTPs to delete')
      return
    }
    
    const deletePromises = snapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref))
    await Promise.all(deletePromises)
    console.log(`Deleted ${snapshot.docs.length} existing OTP(s)`)
  } catch (error) {
    console.error('Error deleting existing OTPs:', error)
    // Don't throw - allow OTP creation to continue even if deletion fails
  }
}

/**
 * Verify OTP
 */
export const verifyOTP = async (email, otp) => {
  try {
    const q = query(
      collection(db, 'otps'),
      where('email', '==', email.toLowerCase()),
      where('otp', '==', otp)
    )
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return { success: false, message: 'Invalid OTP' }
    }
    
    const otpDoc = snapshot.docs[0]
    const otpData = otpDoc.data()
    
    // Check if OTP is expired
    const expiresAt = new Date(otpData.expiresAt)
    const now = new Date()
    
    if (now > expiresAt) {
      // Delete expired OTP
      await deleteDoc(otpDoc.ref)
      return { success: false, message: 'OTP has expired. Please request a new one.' }
    }
    
    // OTP is valid
    return { success: true, message: 'OTP verified successfully', docId: otpDoc.id }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { success: false, message: 'Error verifying OTP' }
  }
}

/**
 * Send OTP via email using EmailJS
 */
export const sendOTPEmail = async (email, otp, userName) => {
  // Always log OTP to console first (for development/testing)
  console.log(`
    ========================================
    OTP EMAIL (Development Mode)
    ========================================
    To: ${email}
    Subject: Password Reset OTP - VisionAttend
    
    Hello ${userName},
    
    Your OTP for password reset is: ${otp}
    
    This OTP will expire in 5 minutes.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    VisionAttend Team
    ========================================
  `)
  
  // Check if EmailJS is properly configured
  if (!isEmailJSConfigured()) {
    console.log('⚠️ EmailJS not configured. Using console output only.')
    return true
  }
  
  try {
    console.log('📧 Attempting to send email via EmailJS...')
    console.log('Service ID:', EMAILJS_CONFIG.SERVICE_ID)
    console.log('Template ID:', EMAILJS_CONFIG.TEMPLATE_ID)
    
    // Initialize EmailJS with public key
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    
    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        to_email: email,
        user_name: userName,
        otp: otp,
        expires_in: '5'
      }
    )
    
    console.log('✅ OTP email sent successfully to', email)
    console.log('EmailJS Response:', response)
    return true
  } catch (emailError) {
    console.error('❌ EmailJS Error:', emailError)
    console.error('Error status:', emailError.status)
    console.error('Error text:', emailError.text)
    console.warn('⚠️ EmailJS failed, but OTP is available in console above')
    // Don't throw - OTP is already logged to console
    return true
  }
}

/**
 * Clean up expired OTPs (should be run periodically)
 */
export const cleanupExpiredOTPs = async () => {
  try {
    const q = query(collection(db, 'otps'))
    const snapshot = await getDocs(q)
    const now = new Date()
    
    const deletePromises = snapshot.docs
      .filter(doc => {
        const expiresAt = new Date(doc.data().expiresAt)
        return now > expiresAt
      })
      .map(doc => deleteDoc(doc.ref))
    
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error)
  }
}
