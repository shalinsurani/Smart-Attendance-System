import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

export const getAdminAnalytics = async (organizationId) => {
  try {
    // Fetch all data
    const [students, teachers, classes, attendance] = await Promise.all([
      getDocs(query(collection(db, 'students'), where('organizationId', '==', organizationId))),
      getDocs(query(collection(db, 'users'), where('organizationId', '==', organizationId), where('role', '==', 'teacher'))),
      getDocs(query(collection(db, 'classes'), where('organizationId', '==', organizationId))),
      getDocs(query(collection(db, 'attendance'), where('organizationId', '==', organizationId)))
    ])

    const studentsData = students.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const teachersData = teachers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const classesData = classes.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const attendanceData = attendance.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }))

    // Calculate today's attendance
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayAttendance = attendanceData.filter(a => {
      const date = new Date(a.timestamp)
      date.setHours(0, 0, 0, 0)
      return date.getTime() === today.getTime() && a.status === 'present'
    })

    const todayAttendanceRate = studentsData.length > 0 
      ? ((todayAttendance.length / studentsData.length) * 100).toFixed(1)
      : 0

    // Calculate last 7 days trend
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, 'MMM dd')
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      const dayAttendance = attendanceData.filter(a => {
        const aDate = new Date(a.timestamp)
        return aDate >= dayStart && aDate <= dayEnd
      })

      const present = dayAttendance.filter(a => a.status === 'present').length
      const absent = dayAttendance.filter(a => a.status === 'absent').length

      last7Days.push({
        date: dateStr,
        present,
        absent,
        total: present + absent
      })
    }

    // Calculate class-wise statistics
    const classStats = classesData.map(cls => {
      const classAttendance = attendanceData.filter(a => a.classId === cls.id)
      const present = classAttendance.filter(a => a.status === 'present').length
      const absent = classAttendance.filter(a => a.status === 'absent').length

      return {
        name: cls.name,
        present,
        absent,
        total: present + absent,
        rate: present + absent > 0 ? ((present / (present + absent)) * 100).toFixed(1) : 0
      }
    })

    // Calculate distribution
    const totalPresent = attendanceData.filter(a => a.status === 'present').length
    const totalAbsent = attendanceData.filter(a => a.status === 'absent').length

    const distribution = [
      { name: 'Present', value: totalPresent },
      { name: 'Absent', value: totalAbsent }
    ]

    // Recent activities
    const recentActivities = attendanceData
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map(a => ({
        id: a.id,
        studentName: a.studentName,
        className: a.className,
        status: a.status,
        timestamp: a.timestamp
      }))

    return {
      overview: {
        totalStudents: studentsData.length,
        totalTeachers: teachersData.length,
        totalClasses: classesData.length,
        todayAttendanceRate
      },
      trends: last7Days,
      classStats,
      distribution,
      recentActivities
    }
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    throw error
  }
}

export const getTeacherAnalytics = async (teacherId, organizationId) => {
  try {
    // Fetch teacher's data
    const [classes, students, attendance] = await Promise.all([
      getDocs(query(collection(db, 'classes'), where('teacherId', '==', teacherId), where('organizationId', '==', organizationId))),
      getDocs(query(collection(db, 'students'), where('teacherId', '==', teacherId), where('organizationId', '==', organizationId))),
      getDocs(query(collection(db, 'attendance'), where('teacherId', '==', teacherId), where('organizationId', '==', organizationId)))
    ])

    const classesData = classes.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const studentsData = students.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const attendanceData = attendance.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }))

    // Calculate average attendance rate
    const totalRecords = attendanceData.length
    const presentRecords = attendanceData.filter(a => a.status === 'present').length
    const avgAttendanceRate = totalRecords > 0 
      ? ((presentRecords / totalRecords) * 100).toFixed(1)
      : 0

    // Today's sessions
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaySessions = attendanceData.filter(a => {
      const date = new Date(a.timestamp)
      date.setHours(0, 0, 0, 0)
      return date.getTime() === today.getTime()
    })

    // Get unique session IDs for today
    const uniqueSessionsToday = new Set(todaySessions.map(a => a.sessionId)).size

    // Last 7 days trend
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, 'MMM dd')
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)

      const dayAttendance = attendanceData.filter(a => {
        const aDate = new Date(a.timestamp)
        return aDate >= dayStart && aDate <= dayEnd
      })

      const present = dayAttendance.filter(a => a.status === 'present').length
      const absent = dayAttendance.filter(a => a.status === 'absent').length

      last7Days.push({
        date: dateStr,
        present,
        absent
      })
    }

    // Class-wise statistics
    const classStats = classesData.map(cls => {
      const classAttendance = attendanceData.filter(a => a.classId === cls.id)
      const present = classAttendance.filter(a => a.status === 'present').length
      const absent = classAttendance.filter(a => a.status === 'absent').length

      return {
        name: cls.name,
        present,
        absent,
        rate: present + absent > 0 ? ((present / (present + absent)) * 100).toFixed(1) : 0
      }
    })

    // Recent sessions
    const sessionMap = new Map()
    attendanceData.forEach(a => {
      if (!sessionMap.has(a.sessionId)) {
        sessionMap.set(a.sessionId, {
          sessionId: a.sessionId,
          className: a.className,
          timestamp: a.timestamp,
          students: []
        })
      }
      sessionMap.get(a.sessionId).students.push({
        name: a.studentName,
        status: a.status
      })
    })

    const recentSessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
      .map(s => ({
        ...s,
        presentCount: s.students.filter(st => st.status === 'present').length,
        totalCount: s.students.length
      }))

    return {
      overview: {
        totalClasses: classesData.length,
        totalStudents: studentsData.length,
        avgAttendanceRate,
        todaySessions: uniqueSessionsToday
      },
      trends: last7Days,
      classStats,
      recentSessions
    }
  } catch (error) {
    console.error('Error fetching teacher analytics:', error)
    throw error
  }
}
