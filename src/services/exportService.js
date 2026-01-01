import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { getLabel } from '../utils/roleMapper'

export const exportAttendanceToExcel = (attendanceData, organizationType = 'school', filename = 'attendance') => {
  try {
    const studentLabel = getLabel('student', organizationType)
    const studentIdLabel = getLabel('studentId', organizationType)
    const classLabel = getLabel('class', organizationType)
    
    const formattedData = attendanceData.map(record => ({
      [studentIdLabel]: record.studentId,
      [`${studentLabel} Name`]: record.studentName,
      [classLabel]: record.className,
      'Date': format(new Date(record.timestamp), 'yyyy-MM-dd'),
      'Time': format(new Date(record.timestamp), 'HH:mm:ss'),
      'Status': record.status,
      'Marked By': record.markedBy,
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')

    const colWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
      { wch: 20 },
    ]
    worksheet['!cols'] = colWidths

    const filenamePrefix = organizationType === 'office' ? 'staff_attendance' : 'student_attendance'
    XLSX.writeFile(workbook, `${filenamePrefix}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw error
  }
}

/**
 * Export student's personal attendance to Excel
 */
export const exportStudentAttendanceToExcel = (attendanceRecords, studentName, studentId) => {
  try {
    const formattedData = attendanceRecords.map(record => {
      let dateStr = 'N/A'
      let timeStr = 'N/A'
      
      try {
        if (record.timestamp) {
          const date = new Date(record.timestamp)
          if (!isNaN(date.getTime())) {
            dateStr = format(date, 'MMM dd, yyyy')
            timeStr = format(date, 'hh:mm a')
          }
        }
      } catch (err) {
        console.error('Error formatting date:', err)
      }
      
      return {
        'Date': dateStr,
        'Time': timeStr,
        'Class/Lecture': record.className || 'N/A',
        'Status': record.status || 'Present',
        'Teacher': record.teacherName || 'N/A'
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'My Attendance')

    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 25 },
      { wch: 10 },
      { wch: 20 }
    ]
    
    const filename = `attendance_${studentId}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    XLSX.writeFile(workbook, filename)
  } catch (error) {
    console.error('Error exporting student attendance to Excel:', error)
    throw error
  }
}


