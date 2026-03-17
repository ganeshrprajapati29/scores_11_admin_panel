import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, 
  Calendar, Trophy, Target, Activity, Shield, AlertTriangle,
  Users, Clock, CheckCircle, XCircle, MoreVertical
} from 'lucide-react'
import adminService from '../../services/admin.service'
const playerService = {
  getById: (id) => adminService.getPlayer(id),
  delete: (id) => adminService.deletePlayer(id),
  verify: (id) => adminService.verifyPlayer(id)
}

const AdminPlayerDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchPlayer()
  }, [id])

  const fetchPlayer = async () => {
    try {
      setLoading(true)
      const response = await playerService.getById(id)
      setPlayer(response.data)
    } catch (err) {
      setError(err.message || 'Failed to fetch player details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerService.delete(id)
        navigate('/admin/players')
      } catch (err) {
        alert(err.message || 'Failed to delete player')
      }
    }
  }

  const handleVerify = async () => {
    try {
      await playerService.verify(id)
      fetchPlayer()
    } catch (err) {
      alert(err.message || 'Failed to verify player')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Player</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchPlayer}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Player Not Found</h3>
        <Link to="/admin/players" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to Players
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'matches', label: 'Matches', icon: Target },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'performance', label: 'Performance', icon: Activity },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/players')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
            <p className="text-gray-500">Player ID: {player._id || id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {player.isVerified ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              <Clock className="w-4 h-4" /> Pending Verification
            </span>
          )}
          <button 
            onClick={handleVerify}
            className="p-2 hover:bg-gray-100 rounded-lg text-green-600"
            title="Verify Player"
          >
            <Shield className="w-5 h-5" />
          </button>
          <Link 
            to={`/admin/players/${id}/edit`}
            className="p-2 hover:bg-gray-100 rounded-lg text-indigo-600"
          >
            <Edit className="w-5 h-5" />
          </Link>
          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Player Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-4xl font-bold">
              {player.name?.charAt(0) || 'P'}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{player.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{player.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{player.location || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{player.role || 'Player'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Batting Style</p>
                <p className="font-medium">{player.battingStyle || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm text-blue-600 font-medium mb-2">Total Matches</h4>
              <p className="text-3xl font-bold text-blue-900">{player.stats?.matches || 0}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm text-green-600 font-medium mb-2">Total Runs</h4>
              <p className="text-3xl font-bold text-green-900">{player.stats?.runs || 0}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm text-purple-600 font-medium mb-2">Total Wickets</h4>
              <p className="text-3xl font-bold text-purple-900">{player.stats?.wickets || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No teams associated with this player</p>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No matches played yet</p>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tournaments participated</p>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No performance data available</p>
          </div>
        )}
      </div>

      {/* Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link 
          to={`/admin/players/${id}/analytics`}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
        >
          <Activity className="w-6 h-6 text-indigo-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Analytics</h3>
          <p className="text-sm text-gray-500">View detailed stats</p>
        </Link>
        <Link 
          to={`/admin/players/${id}/notifications`}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
        >
          <Clock className="w-6 h-6 text-indigo-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <p className="text-sm text-gray-500">Send notifications</p>
        </Link>
        <Link 
          to={`/admin/players/${id}/reports`}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
        >
          <AlertTriangle className="w-6 h-6 text-indigo-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Reports</h3>
          <p className="text-sm text-gray-500">View reports</p>
        </Link>
        <Link 
          to={`/admin/players/${id}/merge`}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
        >
          <Users className="w-6 h-6 text-indigo-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Merge</h3>
          <p className="text-sm text-gray-500">Merge duplicate</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminPlayerDetails

