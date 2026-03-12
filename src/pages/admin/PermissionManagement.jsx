import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, Plus, Edit, Trash2, Search, 
  ChevronRight, Users, Lock, CheckCircle, XCircle
} from 'lucide-react'

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data for permissions
    setPermissions([
      { id: 1, name: 'user_management', description: 'Manage users and their roles', roles: 3, users: 12, enabled: true },
      { id: 2, name: 'player_management', description: 'Manage player profiles and data', roles: 5, users: 25, enabled: true },
      { id: 3, name: 'team_management', description: 'Manage teams and members', roles: 4, users: 18, enabled: true },
      { id: 4, name: 'match_management', description: 'Create and manage matches', roles: 6, users: 30, enabled: true },
      { id: 5, name: 'tournament_management', description: 'Manage tournaments', roles: 4, users: 15, enabled: true },
      { id: 6, name: 'financial_access', description: 'Access financial data and reports', roles: 2, users: 8, enabled: true },
      { id: 7, name: 'content_moderation', description: 'Moderate user content', roles: 3, users: 10, enabled: false },
      { id: 8, name: 'analytics_view', description: 'View analytics and reports', roles: 5, users: 20, enabled: true },
    ])
    setLoading(false)
  }, [])

  const filteredPermissions = permissions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permission Management</h1>
          <p className="text-gray-500">Manage system permissions and access control</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Create Permission
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Permissions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPermissions.map((permission) => (
              <tr key={permission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">{permission.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{permission.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span>{permission.roles} roles</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{permission.users} users</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {permission.enabled ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" /> Enabled
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" /> Disabled
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      to={`/admin/permissions/${permission.id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <Link 
                      to={`/admin/permissions/${permission.id}/roles`}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Lock className="w-4 h-4" />
                    </Link>
                    <Link 
                      to={`/admin/permissions/${permission.id}/users`}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Users className="w-4 h-4" />
                    </Link>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PermissionManagement

