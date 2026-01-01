/**
 * Custom hook for accessing role labels based on organization type
 */

import { useSelector } from 'react-redux'
import { getLabel } from '../utils/roleMapper'

/**
 * Hook that provides role labels based on the current organization type
 * @returns {Object} Object containing role labels and organization type
 */
export const useRoleLabels = () => {
  const { organization } = useSelector((state) => state.organization)
  const orgType = organization?.type || 'school'
  
  return {
    teacher: getLabel('teacher', orgType),
    teachers: getLabel('teachers', orgType),
    student: getLabel('student', orgType),
    students: getLabel('students', orgType),
    studentId: getLabel('studentId', orgType),
    class: getLabel('class', orgType),
    classes: getLabel('classes', orgType),
    orgType
  }
}
