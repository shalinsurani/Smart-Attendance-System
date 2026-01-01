import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { createUser } from './userService'

export const createOrganization = async ({ uid, organizationName, organizationType, adminName, email }) => {
  const orgId = `org_${Date.now()}`
  
  console.log('Creating organization:', { orgId, organizationName, organizationType, uid })
  
  try {
    // Step 1: Create organization document
    console.log('About to call setDoc for organization...')
    
    const orgDocRef = doc(db, 'organizations', orgId)
    const orgData = {
      name: organizationName,
      type: organizationType || 'school',
      adminId: uid,
      createdAt: new Date().toISOString(),
    }
    
    console.log('Organization data:', orgData)
    console.log('Organization doc ref:', orgDocRef.path)
    
    await setDoc(orgDocRef, orgData)
    
    console.log('✅ Organization document created successfully')

    // Step 2: Create admin user document
    console.log('Creating user document:', { uid, adminName, email, role: 'admin', organizationId: orgId })
    
    await createUser({
      uid,
      name: adminName,
      email,
      role: 'admin',
      organizationId: orgId,
    })
    
    console.log('✅ User document created successfully')
    console.log('✅ Registration complete!')

    return orgId
  } catch (error) {
    console.error('❌ Error creating organization - Full error:', error)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error stack:', error.stack)
    
    // Handle specific error cases
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    } else if (error.message) {
      // Re-throw errors from createUser with their specific messages
      throw error
    }
    
    throw new Error('Failed to create organization. Please try again.')
  }
}

export const getOrganizationData = async (orgId) => {
  try {
    const orgDoc = await getDoc(doc(db, 'organizations', orgId))
    if (orgDoc.exists()) {
      return { id: orgDoc.id, ...orgDoc.data() }
    }
    // Organization document doesn't exist
    console.error('Organization document not found for id:', orgId)
    return null
  } catch (error) {
    console.error('Error getting organization:', error)
    
    // Handle specific error cases
    if (error.code === 'permission-denied') {
      throw new Error('Access denied. Cannot access organization data.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    } else if (error.code === 'not-found') {
      throw new Error('Organization not found. Please contact support.')
    }
    
    throw error
  }
}

export const updateOrganization = async (orgId, updates) => {
  try {
    const { updateDoc } = await import('firebase/firestore')
    await updateDoc(doc(db, 'organizations', orgId), {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating organization:', error)
    
    if (error.code === 'permission-denied') {
      throw new Error('Access denied. Cannot update organization.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    }
    
    throw error
  }
}

export const getOrganizationTeachers = async (orgId) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('organizationId', '==', orgId),
      where('role', '==', 'teacher')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting teachers:', error)
    
    // Handle specific error cases
    if (error.code === 'permission-denied') {
      throw new Error('Access denied. Cannot access teacher data.')
    } else if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.')
    }
    
    throw error
  }
}
