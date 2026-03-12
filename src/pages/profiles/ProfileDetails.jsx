import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Trophy,
  Edit, Trash2, CheckCircle, XCircle, Shield, Activity,
  Target, Users, Clock, FileText
} from 'lucide-react'
import { playerProfileService } from '../../services/playerProfile.service'
import toast from 'react-hot-toast'

const ProfileDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await playerProfileService.getById(id)
      setProfile(response.data || response)
    } catch (err) {
      setError(err.message || 'Failed to fetch profile details')
      toast.error(err.message || 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    try {
      // API call to verify profile
      toast.success('Profile verified successfully')
      fetchProfile()
    } catch (err) {
      toast.error(err.message || 'Failed to verify profile')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return
    try {
      await playerProfileService.delete(id)
      toast.success('Profile deleted successfully')
      navigate('/profiles')
    } catch (err) {
      toast.error(err.message || 'Failed to delete profile')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h3>
        <p className="text-red-600">{error || 'Profile not found'}</p>
        <button 
          onClick={() => navigate('/profiles')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Profiles
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'stats', label: 'Statistics', icon: Trophy },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/profiles')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.name || 'Player Profile'}</h1>
            <p className="text-gray-500">Profile ID: {profile._id || id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profile.isVerified ? (
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
            title="Verify Profile"
          >
            <Shield className="w-5 h-5" />
          </button>
          <Link 
            to={`/profiles/${id}/edit`}
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

      {/* Profile Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-4xl font-bold">
              {profile.name?.charAt(0) || 'P'}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profile.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{profile.location || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Player Type</p>
                <p className="font-medium">{profile.playerType || profile.type || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Batting Style</p>
                <p className="font-medium">{profile.battingStyle || 'N/A'}</p>
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
              <p className="text-3xl font-bold text-blue-900">{profile.stats?.matches || 0}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm text-green-600 font-medium mb-2">Total Runs</h4>
              <p className="text-3xl font-bold text-green-900">{profile.stats?.runs || 0}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm text-purple-600 font-medium mb-2">Total Wickets</h4>
              <p className="text-3xl font-bold text-purple-900">{profile.stats?.wickets || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No statistics available</p>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No performance data available</p>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents uploaded</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileDetails

