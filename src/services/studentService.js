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

export const addStudent = async (studentData) => {
  try {
    // Create student document in students collection
    // Note: Firebase Auth account will be created on first login
    const docRef = await addDoc(collection(db, 'students'), {
      name: studentData.name,
      studentId: studentData.studentId,
      email: studentData.email,
      rollNumber: studentData.rollNumber || '',
      phoneNumber: studentData.phoneNumber || '',
      gender: studentData.gender || '',
      classId: studentData.classId || '',
      dateOfBirth: studentData.dateOfBirth || '',
      parentGuardianName: studentData.parentGuardianName || '',
      parentContactNumber: studentData.parentContactNumber || '',
      organizationId: studentData.organizationId,
      teacherId: studentData.teacherId,
      faceDescriptor: studentData.faceDescriptor || null,
      faceEnrolled: !!studentData.faceDescriptor,
      authCreated: false, // Flag to track if Firebase Auth account is created
      createdAt: new Date().toISOString(),
    })
    
    return docRef.id
  } catch (error) {
    console.error('Error adding student:', error)
    throw error
  }
}

export const getStudentsByTeacher = async (teacherId, organizationId) => {
  try {
    const q = query(
      collection(db, 'students'),
      where('teacherId', '==', teacherId),
      where('organizationId', '==', organizationId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting students:', error)
    throw error
  }
}

export const getStudentsByOrganization = async (organizationId) => {
  try {
    const q = query(
      collection(db, 'students'),
      where('organizationId', '==', organizationId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting students:', error)
    throw error
  }
}

export const updateStudent = async (studentDocId, studentData, oldEmail = null) => {
  try {
    // Update student document in Firestore
    await updateDoc(doc(db, 'students', studentDocId), {
      name: studentData.name,
      studentId: studentData.studentId,
      email: studentData.email,
      rollNumber: studentData.rollNumber || '',
      phoneNumber: studentData.phoneNumber || '',
      gender: studentData.gender || '',
      classId: studentData.classId || '',
      dateOfBirth: studentData.dateOfBirth || '',
      parentGuardianName: studentData.parentGuardianName || '',
      parentContactNumber: studentData.parentContactNumber || '',
      updatedAt: new Date().toISOString(),
    })

    // If email changed, update the users collection as well
    if (oldEmail && oldEmail !== studentData.email) {
      // Find and update user document by old email
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', oldEmail)
      )
      const usersSnapshot = await getDocs(usersQuery)
      
      if (!usersSnapshot.empty) {
        const userDocId = usersSnapshot.docs[0].id
        await updateDoc(doc(db, 'users', userDocId), {
          email: studentData.email,
          updatedAt: new Date().toISOString(),
        })
      }

      // Mark that auth needs to be recreated on next login
      await updateDoc(doc(db, 'students', studentDocId), {
        authCreated: false,
        emailChanged: true,
        oldEmail: oldEmail,
      })
    }
  } catch (error) {
    console.error('Error updating student:', error)
    throw error
  }
}

export const updateStudentFace = async (studentDocId, faceDescriptor) => {
  try {
    await updateDoc(doc(db, 'students', studentDocId), {
      faceDescriptor: faceDescriptor,
      faceEnrolled: true,
    })
  } catch (error) {
    console.error('Error updating student face:', error)
    throw error
  }
}

export const deleteStudent = async (studentDocId) => {
  try {
    await deleteDoc(doc(db, 'students', studentDocId))
  } catch (error) {
    console.error('Error deleting student:', error)
    throw error
  }
}
