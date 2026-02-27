import { useState, useEffect } from 'react'
import { 
  Shield, Plus, Edit2, Trash2, Search, 
  CheckCircle, XCircle, Users, Lock 
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Loader } from '../../components/common/Loader'
import { adminService } from '../../services/admin.service'
import { toast } from 'react-hot-toast'

const RoleManagement = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  })

  const availablePermissions = [
    { id: 'users.view', name: 'View Users', category: 'Users' },
    { id: 'users.create', name: 'Create Users', category: 'Users' },
    { id: 'users.edit', name: 'Edit Users', category: 'Users' },
    { id: 'users.delete', name: 'Delete Users', category: 'Users' },
    { id: 'matches.view', name: 'View Matches', category: 'Matches' },
    { id: 'matches.manage', name: 'Manage Matches', category: 'Matches' },
    { id: 'tournaments.view', name: 'View Tournaments', category: 'Tournaments' },
    { id: 'tournaments.manage', name: 'Manage Tournaments', category: 'Tournaments' },
    { id: 'finance.view', name: 'View Financial Data', category: 'Finance' },
    { id: 'finance.manage', name: 'Manage Finance', category: 'Finance' },
    { id: 'content.view', name: 'View Content', category: 'Content' },
    { id: 'content.moderate', name: 'Moderate Content', category: 'Content' },
    { id: 'system.view', name: 'View System', category: 'System' },
    { id: 'system.manage', name: 'Manage System', category: 'System' },
  ]

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await adminService.getRoles()
      setRoles(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedRole) {
        await adminService.updateRole(selectedRole._id, formData)
        toast.success('Role updated successfully')
      } else {
        await adminService.createRole(formData)
        toast.success('Role created successfully')
      }
      setIsModalOpen(false)
      setSelectedRole(null)
      setFormData({ name: '', description: '', permissions: [] })
      fetchRoles()
    } catch (error) {
      toast.error(error.message || 'Failed to save role')
    }
  }

  const handleDelete = async () => {
    try {
      await adminService.deleteRole(selectedRole._id)
      toast.success('Role deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedRole(null)
      fetchRoles()
    } catch (error) {
      toast.error(error.message || 'Failed to delete role')
    }
  }

  const togglePermission = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const openEditModal = (role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    })
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setSelectedRole(null)
    setFormData({ name: '', description: '', permissions: [] })
    setIsModalOpen(true)
  }

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { key: 'name', title: 'Role Name', render: (role) => (
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary-500" />
        <span className="font-medium">{role.name}</span>
      </div>
    )},
    { key: 'description', title: 'Description' },
    { key: 'permissions', title: 'Permissions', render: (role) => (
      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
        {role.permissions?.length || 0} permissions
      </span>
    )},
    { key: 'users', title: 'Users', render: (role) => (
      <div className="flex items-center gap-1 text-gray-600">
        <Users className="w-4 h-4" />
        <span>{role.userCount || 0}</span>
      </div>
    )},
    { key: 'status', title: 'Status', render: (role) => (
      <span className={`flex items-center gap-1 ${role.isActive ? 'text-green-600' : 'text-red-600'}`}>
        {role.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {role.isActive ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'actions', title: 'Actions', render: (role) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openEditModal(role)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedRole(role)
            setIsDeleteDialogOpen(true)
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ]

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Roles Table */}
      <Table
        columns={columns}
        data={filteredRoles}
        emptyMessage="No roles found"
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? 'Edit Role' : 'Create Role'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Content Moderator"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role responsibilities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {availablePermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                    <p className="text-xs text-gray-500">{permission.category}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Role"
        message={`Are you sure you want to delete "${selectedRole?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default RoleManagement
