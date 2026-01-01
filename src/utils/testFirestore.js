// Test Firestore OTP permissions
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export const testOTPPermissions = async () => {
  try {
    console.log('🧪 Testing OTP permissions...')
    
    const testDoc = await addDoc(collection(db, 'otps'), {
      email: 'test@test.com',
      otp: '123456',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      verified: false,
      test: true
    })
    
    console.log('✅ OTP permissions working! Document ID:', testDoc.id)
    return true
  } catch (error) {
    console.error('❌ OTP permissions failed:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    return false
  }
}

// Auto-run test when imported
if (typeof window !== 'undefined') {
  console.log('🔍 Firestore OTP Test loaded. Run testOTPPermissions() to test.')
}
