import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return { uid, ...userDoc.data() }
    }
    // User document doesn't exist
    console.error('User document not found for uid:', uid)
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    
    // Handle specific error cases
    if (error.code === 'permission-denied') {
      throw new Error('Access denied. Please check your permissions.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    } else if (error.code === 'not-found') {
      throw new Error('User profile not found. Please contact support.')
    }
    
    throw error
  }
}

export const createUser = async (userData) => {
  try {
    console.log('createUser called with:', userData)
    
    const userDocData = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      organizationId: userData.organizationId,
      createdAt: new Date().toISOString(),
      ...(userData.studentId && { studentId: userData.studentId }),
      ...(userData.faceDescriptor && { faceDescriptor: userData.faceDescriptor }),
    }
    
    console.log('Creating user document with data:', userDocData)
    
    await setDoc(doc(db, 'users', userData.uid), userDocData)
    
    console.log('User document created successfully!')
  } catch (error) {
    console.error('Error creating user - Full error:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    // Handle specific error cases
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    }
    
    throw error
  }
}

export const updateUser = async (uid, userData) => {
  try {
    const updateData = {
      name: userData.name,
      email: userData.email,
      updatedAt: new Date().toISOString(),
    }
    
    // Add optional fields if provided
    if (userData.phoneNumber !== undefined) updateData.phoneNumber = userData.phoneNumber
    if (userData.gender !== undefined) updateData.gender = userData.gender
    if (userData.department !== undefined) updateData.department = userData.department
    if (userData.designation !== undefined) updateData.designation = userData.designation
    if (userData.employeeId !== undefined) updateData.employeeId = userData.employeeId
    if (userData.dateOfJoining !== undefined) updateData.dateOfJoining = userData.dateOfJoining
    if (userData.status !== undefined) updateData.status = userData.status
    
    await updateDoc(doc(db, 'users', uid), updateData)
  } catch (error) {
    console.error('Error updating user:', error)
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Cannot update user data.')
    } else if (error.code === 'not-found') {
      throw new Error('User not found.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    }
    
    throw error
  }
}

export const deleteUser = async (uid) => {
  try {
    const { deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc(db, 'users', uid))
  } catch (error) {
    console.error('Error deleting user:', error)
    
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Cannot delete user.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    }
    
    throw error
  }
}

export const updateUserFaceDescriptor = async (uid, descriptor) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      faceDescriptor: descriptor,
      faceEnrolled: true,
    })
  } catch (error) {
    console.error('Error updating face descriptor:', error)
    
    // Handle specific error cases
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Cannot update face data.')
    } else if (error.code === 'not-found') {
      throw new Error('User not found. Cannot update face data.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    }
    
    throw error
  }
}
