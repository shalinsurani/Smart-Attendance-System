import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

export const markAttendance = async (attendanceData) => {
  try {
    const docRef = await addDoc(collection(db, 'attendance'), {
      studentId: attendanceData.studentId,
      studentName: attendanceData.studentName,
      teacherId: attendanceData.teacherId,
      classId: attendanceData.classId,
      className: attendanceData.className,
      organizationId: attendanceData.organizationId,
      status: 'present',
      timestamp: Timestamp.now(),
      sessionId: attendanceData.sessionId,
      markedBy: 'face-recognition',
    })
    return docRef.id
  } catch (error) {
    console.error('Error marking attendance:', error)
    throw error
  }
}

export const getAttendanceRecords = async (filters) => {
  try {
    const constraints = []

    // Start with required filters
    if (filters.organizationId) {
      constraints.push(where('organizationId', '==', filters.organizationId))
    }
    if (filters.teacherId) {
      constraints.push(where('teacherId', '==', filters.teacherId))
    }
    if (filters.studentId) {
      constraints.push(where('studentId', '==', filters.studentId))
    }
    if (filters.classId) {
      constraints.push(where('classId', '==', filters.classId))
    }

    // Add orderBy - this requires a composite index if combined with where clauses
    // For now, we'll sort in memory to avoid index requirement
    
    const q = query(collection(db, 'attendance'), ...constraints)
    const snapshot = await getDocs(q)
    
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    }))

    // Sort by timestamp in memory (descending - newest first)
    records.sort((a, b) => {
      const timeA = a.timestamp ? a.timestamp.getTime() : 0
      const timeB = b.timestamp ? b.timestamp.getTime() : 0
      return timeB - timeA
    })
    
    return records
  } catch (error) {
    console.error('Error getting attendance records:', error)
    throw error
  }
}

export const getStudentAttendance = async (studentId, organizationId) => {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('studentId', '==', studentId),
      where('organizationId', '==', organizationId)
    )
    const snapshot = await getDocs(q)
    
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    }))

    // Sort by timestamp in memory (descending - newest first)
    records.sort((a, b) => {
      const timeA = a.timestamp ? a.timestamp.getTime() : 0
      const timeB = b.timestamp ? b.timestamp.getTime() : 0
      return timeB - timeA
    })
    
    return records
  } catch (error) {
    console.error('Error getting student attendance:', error)
    throw error
  }
}
