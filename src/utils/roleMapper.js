/**
 * Role Mapper Utility
 * Maps role terminology based on organization type
 */

/**
 * Get role labels based on organization type
 * @param {string} organizationType - Type of organization (school, college, office)
 * @returns {Object} Object containing role label mappings
 */
export const getRoleLabels = (organizationType) => {
  const mappings = {
    office: {
      teacher: 'Manager',
      teachers: 'Managers',
      student: 'Staff',
      students: 'Staff',
      studentId: 'Employee ID',
      class: 'Department',
      classes: 'Departments'
    },
    school: {
      teacher: 'Teacher',
      teachers: 'Teachers',
      student: 'Student',
      students: 'Students',
      studentId: 'Student ID',
      class: 'Class',
      classes: 'Classes'
    },
    college: {
      teacher: 'Teacher',
      teachers: 'Teachers',
      student: 'Student',
      students: 'Students',
      studentId: 'Student ID',
      class: 'Class',
      classes: 'Classes'
    }
  }
  
  return mappings[organizationType] || mappings.school
}

/**
 * Get a specific label based on key and organization type
 * @param {string} key - Label key (e.g., 'teacher', 'student', 'studentId')
 * @param {string} organizationType - Type of organization (school, college, office)
 * @returns {string} The appropriate label for the given key and organization type
 */
export const getLabel = (key, organizationType) => {
  const labels = getRoleLabels(organizationType)
  return labels[key] || key
}
