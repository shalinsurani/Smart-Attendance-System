import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth)
  const { organization } = useSelector((state) => state.organization)

  if (!user) {
    return <Navigate to="/login" />
  }

  // Check if admin needs to complete organization setup
  if (user.role === 'admin' && organization && !organization.setupCompleted) {
    return <Navigate to="/organization-setup" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} />
  }

  return children
}

export default ProtectedRoute
