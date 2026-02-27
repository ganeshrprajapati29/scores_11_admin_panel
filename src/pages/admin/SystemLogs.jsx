import { useState, useEffect, useMemo } from 'react'
import { 
  Database, Search, Filter, Download, Calendar,
  User, Activity, AlertTriangle, Info, CheckCircle,
  XCircle, RefreshCw, Trash2, X
} from 'lucide-react'

import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Table from '../../components/common/Table'
import Loader from '../../components/common/Loader'
import Pagination from '../../components/common/Pagination'
import adminService from '../../services/admin.service'

import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const SystemLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [filterType, setFilterType] = useState('all')

  const [filterAction, setFilterAction] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const logTypes = [
    { id: 'all', name: 'All Types', icon: Database },
    { id: 'info', name: 'Info', icon: Info, color: 'text-blue-600' },
    { id: 'success', name: 'Success', icon: CheckCircle, color: 'text-green-600' },
    { id: 'warning', name: 'Warning', icon: AlertTriangle, color: 'text-yellow-600' },
    { id: 'error', name: 'Error', icon: XCircle, color: 'text-red-600' },
  ]

  const actionTypes = [
    { id: 'all', name: 'All Actions' },
    { id: 'create', name: 'Create' },
    { id: 'update', name: 'Update' },
    { id: 'delete', name: 'Delete' },
    { id: 'login', name: 'Login' },
    { id: 'logout', name: 'Logout' },
    { id: 'export', name: 'Export' },
    { id: 'import', name: 'Import' },
  ]

  // Debounce search query
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setIsSearching(false)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    fetchLogs()
  }, [currentPage, filterType, filterAction, debouncedSearchQuery])


  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await adminService.getSystemLogs({
        page: currentPage,
        type: filterType !== 'all' ? filterType : undefined,
        action: filterAction !== 'all' ? filterAction : undefined,
        search: debouncedSearchQuery || undefined,

        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      })
      setLogs(response.data?.logs || [])
      setTotalPages(response.data?.pagination?.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch system logs')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await adminService.exportLogs({
        type: filterType !== 'all' ? filterType : undefined,
        action: filterAction !== 'all' ? filterAction : undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      })
      
      // Create and download CSV
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Logs exported successfully')
    } catch (error) {
      toast.error('Failed to export logs')
    }
  }

  const handleClearOldLogs = async () => {
    if (!confirm('Are you sure you want to delete logs older than 30 days?')) return
    
    try {
      await adminService.clearOldLogs()
      toast.success('Old logs cleared successfully')
      fetchLogs()
    } catch (error) {
      toast.error('Failed to clear old logs')
    }
  }

  const getLogIcon = (type) => {
    const logType = logTypes.find(t => t.id === type)
    const Icon = logType?.icon || Info
    return <Icon className={`w-5 h-5 ${logType?.color || 'text-gray-600'}`} />
  }

  // Advanced search algorithm for logs
  const filteredLogs = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return logs

    const query = debouncedSearchQuery.toLowerCase().trim()
    const queryWords = query.split(/\s+/).filter(word => word.length > 0)
    
    return logs.filter(log => {
      const user = log.user || {}
      const searchFields = [
        log.action?.toLowerCase() || '',
        log.type?.toLowerCase() || '',
        log.resource?.toLowerCase() || '',
        log.resourceId?.toLowerCase() || '',
        log.details?.toLowerCase() || '',
        user.name?.toLowerCase() || '',
        log.ipAddress?.toLowerCase() || ''
      ]
      
      const searchText = searchFields.join(' ')
      
      // Check if all query words are present in search fields
      return queryWords.every(word => searchText.includes(word))
    }).sort((a, b) => {
      // Ranking algorithm: prioritize action and resource matches
      const aAction = a.action?.toLowerCase() || ''
      const bAction = b.action?.toLowerCase() || ''
      const aResource = a.resource?.toLowerCase() || ''
      const bResource = b.resource?.toLowerCase() || ''
      const queryLower = query.toLowerCase()
      
      // Exact action match gets highest priority
      if (aAction === queryLower && bAction !== queryLower) return -1
      if (bAction === queryLower && aAction !== queryLower) return 1
      
      // Action starts with query gets second priority
      const aActionStarts = aAction.startsWith(queryLower)
      const bActionStarts = bAction.startsWith(queryLower)
      if (aActionStarts && !bActionStarts) return -1
      if (bActionStarts && !aActionStarts) return 1
      
      // Resource starts with query gets third priority
      const aResourceStarts = aResource.startsWith(queryLower)
      const bResourceStarts = bResource.startsWith(queryLower)
      if (aResourceStarts && !bResourceStarts) return -1
      if (bResourceStarts && !aResourceStarts) return 1
      
      // Default: sort by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [logs, debouncedSearchQuery])

  const clearSearch = () => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
  }

  const highlightMatch = (text, query) => {
    if (!query.trim() || !text) return text
    
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    if (!textLower.includes(queryLower)) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === queryLower ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    )
  }


  const columns = [
    { key: 'timestamp', title: 'Timestamp', render: (log) => (
      <div className="text-sm text-gray-600">
        {formatDate(log.createdAt, 'MMM DD, YYYY HH:mm:ss')}
      </div>
    )},
    { key: 'type', title: 'Type', render: (log) => (
      <div className="flex items-center gap-2">
        {getLogIcon(log.type)}
        <span className="capitalize text-sm font-medium">{log.type}</span>
      </div>
    )},
    { key: 'action', title: 'Action', render: (log) => (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium uppercase">
        {highlightMatch(log.action, debouncedSearchQuery)}
      </span>
    )},
    { key: 'user', title: 'User', render: (log) => (
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{highlightMatch(log.user?.name || 'System', debouncedSearchQuery)}</span>
      </div>
    )},
    { key: 'resource', title: 'Resource', render: (log) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{highlightMatch(log.resource, debouncedSearchQuery)}</p>
        <p className="text-xs text-gray-500">{highlightMatch(log.resourceId, debouncedSearchQuery)}</p>
      </div>
    )},
    { key: 'details', title: 'Details', render: (log) => (
      <p className="text-sm text-gray-600 max-w-xs truncate" title={log.details}>
        {highlightMatch(log.details, debouncedSearchQuery)}
      </p>
    )},

    { key: 'ip', title: 'IP Address', render: (log) => (
      <span className="text-sm text-gray-500 font-mono">{log.ipAddress}</span>
    )},
  ]

  if (loading && logs.length === 0) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-1">View and manage system audit logs</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="danger" 
            onClick={handleClearOldLogs}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Old
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isSearching ? 'text-primary-500 animate-pulse' : 'text-gray-400'}`} />
            <Input
              type="text"
              placeholder="Search by action, user, resource, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>


          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {logTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {actionTypes.map(action => (
              <option key={action.id} value={action.id}>{action.name}</option>
            ))}
          </select>

          {/* Refresh */}
          <Button 
            variant="secondary" 
            onClick={fetchLogs}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Date Range */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              placeholder="Start Date"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">to</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {logTypes.filter(t => t.id !== 'all').map(type => {
          const count = logs.filter(l => l.type === type.id).length
          return (
            <div key={type.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <type.icon className={`w-5 h-5 ${type.color}`} />
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
              <p className="text-sm text-gray-600 capitalize mt-1">{type.name} Logs</p>
            </div>
          )
        })}
      </div>

      {/* Search Results Info */}
      {debouncedSearchQuery && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Found {filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''} 
            {isSearching ? ' (searching...)' : ''}
          </span>
          {filteredLogs.length > 0 && (
            <span className="text-gray-500">Sorted by relevance</span>
          )}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={filteredLogs}
          emptyMessage={debouncedSearchQuery ? `No results found for "${debouncedSearchQuery}"` : "No logs found"}
        />
        
        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

    </div>
  )
}

export default SystemLogs
