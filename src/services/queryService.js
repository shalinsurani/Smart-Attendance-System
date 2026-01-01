import { collection, addDoc, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Create a new query (contact teacher or report issue)
 */
export const createQuery = async (queryData) => {
  try {
    const queryRef = await addDoc(collection(db, 'queries'), {
      ...queryData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return queryRef.id
  } catch (error) {
    console.error('Error creating query:', error)
    throw error
  }
}

/**
 * Get queries for a teacher
 */
export const getTeacherQueries = async (teacherId, organizationId) => {
  try {
    const q = query(
      collection(db, 'queries'),
      where('teacherId', '==', teacherId),
      where('organizationId', '==', organizationId),
      where('type', '==', 'contact_teacher'),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching teacher queries:', error)
    throw error
  }
}

/**
 * Get all queries for admin (both contact teacher and report issue)
 */
export const getAdminQueries = async (organizationId) => {
  try {
    const q = query(
      collection(db, 'queries'),
      where('organizationId', '==', organizationId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching admin queries:', error)
    throw error
  }
}

/**
 * Update query status
 */
export const updateQueryStatus = async (queryId, status, response = '') => {
  try {
    const queryRef = doc(db, 'queries', queryId)
    await updateDoc(queryRef, {
      status,
      response,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating query status:', error)
    throw error
  }
}

/**
 * Get student's queries
 */
export const getStudentQueries = async (studentId, organizationId) => {
  try {
    const q = query(
      collection(db, 'queries'),
      where('studentId', '==', studentId),
      where('organizationId', '==', organizationId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching student queries:', error)
    throw error
  }
}
