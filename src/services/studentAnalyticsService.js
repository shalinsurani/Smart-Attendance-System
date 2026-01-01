import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, subDays, eachDayOfInterval } from 'date-fns'

/**
 * Get comprehensive analytics for a student
 * @param {string} studentId - Student's ID
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} Analytics data
 */
export const getStudentAnalytics = async (studentId, organizationId) => {
  try {
    // Fetch all attendance records for the student
    // Try by studentId first, then by email if it looks like an email
    let attendanceQuery
    if (studentId && studentId.includes('@')) {
      // If studentId looks like an email, query by email field
      attendanceQuery = query(
        collection(db, 'attendance'),
        where('email', '==', studentId),
        where('organizationId', '==', organizationId)
      )
    } else {
      // Query by studentId
      attendanceQuery = query(
        collection(db, 'attendance'),
        where('studentId', '==', studentId),
        where('organizationId', '==', organizationId)
      )
    }
    
    const snapshot = await getDocs(attendanceQuery)
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp
    }))

    // Sort by timestamp (handle invalid timestamps)
    records.sort((a, b) => {
      try {
        const dateA = new Date(a.timestamp)
        const dateB = new Date(b.timestamp)
        if (isNaN(dateA) || isNaN(dateB)) return 0
        return dateB - dateA
      } catch {
        return 0
      }
    })

    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Calculate statistics
    const totalAttendance = records.length
    
    const thisWeekRecords = records.filter(r => {
      const date = new Date(r.timestamp)
      return date >= weekStart && date <= weekEnd
    })
    
    const thisMonthRecords = records.filter(r => {
      const date = new Date(r.timestamp)
      return date >= monthStart && date <= monthEnd
    })

    // Get unique classes attended
    const uniqueClasses = new Set(records.map(r => r.classId))
    const totalClasses = uniqueClasses.size

    // Calculate attendance by class
    const classCounts = {}
    const classNames = {}
    records.forEach(r => {
      if (!classCounts[r.classId]) {
        classCounts[r.classId] = 0
        classNames[r.classId] = r.className || 'Unknown Class'
      }
      classCounts[r.classId]++
    })

    const classStats = Object.keys(classCounts).map(classId => ({
      classId,
      className: classNames[classId],
      count: classCounts[classId]
    })).sort((a, b) => b.count - a.count)

    // Last 7 days trend
    const last7Days = eachDayOfInterval({
      start: subDays(now, 6),
      end: now
    })

    const weeklyTrend = last7Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const count = records.filter(r => {
        try {
          if (!r.timestamp) return false
          const recordDate = format(new Date(r.timestamp), 'yyyy-MM-dd')
          return recordDate === dayStr
        } catch (error) {
          return false
        }
      }).length
      
      return {
        date: format(day, 'MMM dd'),
        count
      }
    })

    // Monthly trend (last 30 days)
    const last30Days = eachDayOfInterval({
      start: subDays(now, 29),
      end: now
    })

    const monthlyTrend = last30Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const count = records.filter(r => {
        try {
          if (!r.timestamp) return false
          const recordDate = format(new Date(r.timestamp), 'yyyy-MM-dd')
          return recordDate === dayStr
        } catch (error) {
          return false
        }
      }).length
      
      return {
        date: format(day, 'MMM dd'),
        count
      }
    })

    // Attendance by day of week
    const dayOfWeekCounts = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0
    }

    records.forEach(r => {
      try {
        if (!r.timestamp) return
        const dayName = format(new Date(r.timestamp), 'EEEE')
        if (dayOfWeekCounts[dayName] !== undefined) {
          dayOfWeekCounts[dayName]++
        }
      } catch (error) {
        // Skip invalid timestamps
      }
    })

    const dayOfWeekStats = Object.keys(dayOfWeekCounts).map(day => ({
      day,
      count: dayOfWeekCounts[day]
    }))

    // Recent activity with teacher info
    const recentActivity = records.slice(0, 50).map(r => ({
      id: r.id,
      className: r.className,
      timestamp: r.timestamp,
      status: r.status || 'present',
      teacherName: r.teacherName || 'N/A'
    }))

    // Today's status - check if student has attendance today
    const todayStr = format(now, 'yyyy-MM-dd')
    const todayRecords = records.filter(r => {
      try {
        if (!r.timestamp) return false
        const recordDate = format(new Date(r.timestamp), 'yyyy-MM-dd')
        return recordDate === todayStr
      } catch (error) {
        return false
      }
    })
    
    const todayStatus = todayRecords.length > 0 ? {
      timestamp: todayRecords[0].timestamp,
      className: todayRecords[0].className,
      status: todayRecords[0].status || 'present',
      teacherName: todayRecords[0].teacherName || 'N/A'
    } : null

    // Enhanced class statistics with attendance/total ratio
    // For now, we'll use attendance count as both attended and total
    // In a real scenario, you'd query total classes from a classes collection
    const enhancedClassStats = Object.keys(classCounts).map(classId => ({
      classId,
      className: classNames[classId],
      attended: classCounts[classId],
      total: classCounts[classId], // This should be fetched from actual class schedule
      percentage: 100 // Since we only have attendance records
    })).sort((a, b) => b.attended - a.attended)

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let lastDate = null

    const sortedByDate = [...records].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    )

    sortedByDate.forEach(r => {
      try {
        if (!r.timestamp) return
        const recordDate = format(new Date(r.timestamp), 'yyyy-MM-dd')
        
        if (!lastDate) {
          tempStreak = 1
        } else {
          const daysDiff = Math.floor(
            (new Date(recordDate) - new Date(lastDate)) / (1000 * 60 * 60 * 24)
          )
          
          if (daysDiff === 1) {
            tempStreak++
          } else if (daysDiff > 1) {
            longestStreak = Math.max(longestStreak, tempStreak)
            tempStreak = 1
          }
        }
        
        lastDate = recordDate
      } catch (error) {
        // Skip invalid timestamps
      }
    })

    longestStreak = Math.max(longestStreak, tempStreak)
    
    // Check if current streak is active (last attendance was today or yesterday)
    if (records.length > 0) {
      try {
        const lastRecord = records[0]
        if (lastRecord.timestamp) {
          const daysSinceLastAttendance = Math.floor(
            (now - new Date(lastRecord.timestamp)) / (1000 * 60 * 60 * 24)
          )
          
          if (daysSinceLastAttendance <= 1) {
            currentStreak = tempStreak
          }
        }
      } catch (error) {
        // Skip if timestamp is invalid
      }
    }

    return {
      overview: {
        totalAttendance,
        thisWeek: thisWeekRecords.length,
        thisMonth: thisMonthRecords.length,
        totalClasses: totalAttendance, // Using attendance count as total for now
        currentStreak,
        longestStreak,
        attendancePercentage: totalAttendance > 0 ? 100 : 0, // Will be calculated in component
        presentCount: totalAttendance,
        absentCount: 0 // Would need total scheduled classes to calculate
      },
      weeklyTrend,
      monthlyTrend,
      classStats: enhancedClassStats,
      dayOfWeekStats,
      recentActivity,
      todayStatus,
      allRecords: records
    }
  } catch (error) {
    console.error('Error fetching student analytics:', error)
    throw error
  }
}
