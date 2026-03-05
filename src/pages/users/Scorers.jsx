import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, Mail, Phone, Calendar,
  Shield, ChevronRight, ClipboardList, Award
} from 'lucide-react'
import { userAPI } from '../../services/api'

const Scorers = () => {
  const [scorers, setScorers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedScorer, setSelectedScorer] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  useEffect(() => {
    fetchScorers()
  }, [pagination.page, filter])

  const fetchScorers = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: 'scorer'
      })
      setScorers(response.data.users || [])
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0
      }))
    } catch (error) {
      console.error('Error fetching scorers:', error)
      // Mock data
      setScorers([
        { _id: '1', name: 'Raj Kumar', email: 'raj@example.com', phone: '+91 98765 43210', role: 'scorer', matchesScored: 45, isVerified: true, avatar: null, createdAt: '2024-01-15' },
        { _id: '2', name: 'Anil Singh', email: 'anil@example.com', phone: '+91 98765 43211', role: 'scorer', matchesScored: 32, isVerified: true, avatar: null, createdAt: '2024-01-16' },
        { _id: '3', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43212', role: 'scorer', matchesScored: 28, isVerified: true, avatar: null, createdAt: '2024-01-17' },
        { _id: '4', name: 'Vikram Patel', email: 'vikram@example.com', phone: '+91 98765 43213', role: 'scorer', matchesScored: 15, isVerified: false, avatar: null, createdAt: '2024-01-18' },
        { _id: '5', name: 'Suresh Reddy', email: 'suresh@example.com', phone: '+91 98765 43214', role: 'scorer', matchesScored: 52, isVerified: true, avatar: null, createdAt: '2024-01-19' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (scorerId) => {
    try {
      await userAPI.updateUser(scorerId, { isVerified: true })
      fetchScorers()
    } catch (error) {
      console.error('Error verifying scorer:', error)
    }
  }

  const handleRemove = async (scorerId) => {
    try {
      await userAPI.deleteUser(scorerId)
      fetchScorers()
    } catch (error) {
      console.error('Error removing scorer:', error)
    }
  }

  const filteredScorers = scorers.filter(scorer => 
    scorer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scorer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scorers</h1>
          <p className="text-gray-500 mt-1">Manage cricket scorers and their assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <ClipboardList size={18} />
            Export List
          </button>
          <Link to="/users/create?role=scorer" className="btn-primary flex items-center gap-2">
            <Users size={18} />
            Add Scorer
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scorers.length}</p>
              <p className="text-sm text-gray-500">Total Scorers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scorers.filter(s => s.isVerified).length}</p>
              <p className="text-sm text-gray-500">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scorers.reduce((acc, s) => acc + (s.matchesScored || 0), 0)}</p>
              <p className="text-sm text-gray-500">Matches Scored</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scorers.filter(s => !s.isVerified).length}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scorers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scorer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matches Scored</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : filteredScorers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <ClipboardList size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No scorers found</p>
                  </td>
                </tr>
              ) : (
                filteredScorers.map((scorer) => (
                  <tr key={scorer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                          {scorer.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{scorer.name}</p>
                          <p className="text-sm text-gray-500">ID: {scorer._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          {scorer.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          {scorer.phone || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-gray-900">{scorer.matchesScored || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      {scorer.isVerified ? (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle size={16} />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-yellow-600">
                          <XCircle size={16} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {scorer.createdAt ? new Date(scorer.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedScorer(scorer)
                            setShowModal(true)
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical size={18} />
                        </button>
                        <Link 
                          to={`/users/${scorer._id}`}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedScorer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Scorer Actions</h2>
            <div className="space-y-3">
              {!selectedScorer.isVerified && (
                <button 
                  onClick={() => {
                    handleVerify(selectedScorer._id)
                    setShowModal(false)
                  }}
                  className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-left flex items-center gap-3"
                >
                  <CheckCircle size={20} />
                  Verify Scorer
                </button>
              )}
              <button className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-left flex items-center gap-3">
                <Calendar size={20} />
                Assign Match
              </button>
              <button className="w-full px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-left flex items-center gap-3">
                <Award size={20} />
                View Statistics
              </button>
              <button 
                onClick={() => {
                  handleRemove(selectedScorer._id)
                  setShowModal(false)
                }}
                className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-left flex items-center gap-3"
              >
                <XCircle size={20} />
                Remove Scorer
              </button>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-4 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Scorers
