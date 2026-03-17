import { Navigate, useLocation } from 'react-router-dom'
import { useCanAccessAdmin } from '../hooks/usePermission'
import Loader from '../components/common/Loader'
import { toast } from 'react-hot-toast'

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation()
  const { allowed, loading } = useCanAccessAdmin()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-500">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!allowed) {
    toast.error('Access denied. Admin permissions required.')
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return children
}

export default AdminProtectedRoute

