import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore'
import { db } from '../config/firebase'

export const createClass = async (classData) => {
  try {
    const docRef = await addDoc(collection(db, 'classes'), {
      name: classData.name,
      subject: classData.subject,
      classCode: classData.classCode,
      department: classData.department,
      location: classData.location,
      classType: classData.classType || 'Lecture',
      teacherId: classData.teacherId,
      teacherName: classData.teacherName,
      organizationId: classData.organizationId,
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating class:', error)
    throw error
  }
}

export const getClassesByTeacher = async (teacherId, organizationId) => {
  try {
    const q = query(
      collection(db, 'classes'),
      where('teacherId', '==', teacherId),
      where('organizationId', '==', organizationId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting classes:', error)
    throw error
  }
}

export const getClassesByOrganization = async (organizationId) => {
  try {
    const q = query(
      collection(db, 'classes'),
      where('organizationId', '==', organizationId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting classes:', error)
    throw error
  }
}

export const updateClass = async (classId, updates) => {
  try {
    await updateDoc(doc(db, 'classes', classId), updates)
  } catch (error) {
    console.error('Error updating class:', error)
    throw error
  }
}

export const deleteClass = async (classId) => {
  try {
    await deleteDoc(doc(db, 'classes', classId))
  } catch (error) {
    console.error('Error deleting class:', error)
    throw error
  }
}
