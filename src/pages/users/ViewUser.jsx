import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, User, Mail, Phone, Calendar, MapPin, 
  Shield, Activity, Award, Star, Target, Trophy,
  CheckCircle, XCircle, Clock, Globe, BookOpen,
  Users, Zap, TrendingUp, Download, Edit, Trash2,
  Camera, Map, Flag, Heart, Share2
} from 'lucide-react'
import { usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ViewUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview') // overview, cricket, stats, activity

  useEffect(() => {
    // Check if id is invalid
    if (!id || id === 'create' || id === 'undefined' || id === 'edit') {
      navigate('/admin/users')
      return
    }
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getById(id)
      setUser(response.data || response)
    } catch (error) {
      console.error('Fetch user error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch user')
      navigate('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    try {
      await usersAPI.update(id, { isActive: !user.isActive })
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`)
      fetchUser()
    } catch (error) {
      console.error('Status toggle error:', error)
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      await usersAPI.delete(id)
      toast.success('User deleted successfully')
      navigate('/admin/users')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'player': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'captain': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'manager': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'user': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getLevelDetails = (level) => {
    const levels = {
      1: { label: 'Beginner', color: 'bg-green-100 text-green-700', icon: '🌱' },
      2: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700', icon: '📘' },
      3: { label: 'Advanced', color: 'bg-orange-100 text-orange-700', icon: '⚡' },
      4: { label: 'Expert', color: 'bg-purple-100 text-purple-700', icon: '💎' },
      5: { label: 'Professional', color: 'bg-red-100 text-red-700', icon: '🏆' }
    }
    return levels[level] || { label: 'Beginner', color: 'bg-gray-100 text-gray-700', icon: '👤' }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-xl mb-2">User not found</p>
        <p className="text-gray-400 mb-6">The user you're looking for doesn't exist or has been deleted</p>
        <Link to="/admin/users" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to Users
        </Link>
      </div>
    )
  }

  const levelDetails = getLevelDetails(user.level)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/users" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-500">Detailed information about the user</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/users/${id}/edit`}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Edit size={18} />
            Edit User
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
          {user.coverPhoto?.url && (
            <img 
              src={user.coverPhoto.url} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-50"
            />
          )}
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
                  {user.avatar?.url ? (
                    <img 
                      src={user.avatar.url} 
                      alt={user.fullName || user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user.fullName || user.name)
                  )}
                </div>
              </div>
              {user.isEmailVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                  <CheckCircle size={14} className="text-white" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.fullName || user.name || 'N/A'}
                </h2>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${levelDetails.color}`}>
                  {levelDetails.icon} {levelDetails.label} (Lvl {user.level || 1})
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail size={14} />
                  {user.email}
                </span>
                {user.username && (
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    @{user.username}
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex flex-col items-end gap-2">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                user.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {user.isActive ? 'Active Account' : 'Inactive Account'}
              </span>
              <button
                onClick={handleStatusToggle}
                className={`text-sm font-medium ${
                  user.isActive 
                    ? 'text-red-600 hover:text-red-700' 
                    : 'text-green-600 hover:text-green-700'
                }`}
              >
                {user.isActive ? 'Deactivate Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <nav className="flex gap-1 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="inline w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('cricket')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'cricket'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="inline w-4 h-4 mr-2" />
            Cricket Profile
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="inline w-4 h-4 mr-2" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="inline w-4 h-4 mr-2" />
            Activity
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-800">
                    {user.dateOfBirth ? formatDate(user.dateOfBirth).split(',')[0] : 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Heart className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {user.gender?.replace('-', ' ') || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-800">
                    {[user.location?.city, user.location?.state, user.location?.country]
                      .filter(Boolean).join(', ') || 'Not provided'}
                  </p>
                </div>
              </div>

              {user.bio && (
                <div className="flex items-start gap-3">
                  <BookOpen className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Bio</p>
                    <p className="text-gray-800 text-sm">{user.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Verified</span>
                {user.isEmailVerified ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={16} />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle size={16} />
                    Not Verified
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone Verified</span>
                {user.isPhoneVerified ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={16} />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle size={16} />
                    Not Verified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profile Complete</span>
                <span className={`font-medium ${user.isProfileComplete ? 'text-green-600' : 'text-orange-600'}`}>
                  {user.isProfileComplete ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Joined</span>
                  <span className="text-gray-700">{formatDate(user.createdAt)}</span>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Last Login</span>
                    <span className="text-gray-700">{formatDate(user.lastLogin)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Referral Info */}
          {user.referralCode && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Referral Code</p>
                  <p className="font-mono font-medium text-gray-800">{user.referralCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referral Earnings</p>
                  <p className="text-xl font-bold text-green-600">₹{user.referralEarnings || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Dynamic Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-xl font-bold text-gray-900">{user.experiencePoints || 0} XP</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500">Matches</p>
                  <p className="text-xl font-bold text-gray-900">{user.stats?.matchesPlayed || 0}</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-500">Tournaments</p>
                  <p className="text-xl font-bold text-gray-900">{user.stats?.tournamentsPlayed || 0}</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-500">Awards</p>
                  <p className="text-xl font-bold text-gray-900">{user.stats?.manOfTheMatch || 0}</p>
                </div>
              </div>

              {/* Achievements */}
              {user.achievements && user.achievements.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                  <div className="space-y-3">
                    {user.achievements.slice(0, 5).map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{achievement.name || 'Achievement'}</p>
                          <p className="text-xs text-gray-500">{achievement.earnedAt ? formatDate(achievement.earnedAt) : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teams */}
              {user.teams && user.teams.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Teams</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {user.teams.map((team, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{team.name || 'Team'}</p>
                          {team.role && (
                            <p className="text-xs text-gray-500 capitalize">{team.role}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Cricket Profile Tab */}
          {activeTab === 'cricket' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Cricket Profile</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Player Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Player Type</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {user.cricketProfile?.playerType || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Batting Style</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {user.cricketProfile?.battingStyle?.replace('-', ' ') || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Bowling Style</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {user.cricketProfile?.bowlingStyle?.replace('-', ' ') || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Preferred Roles</span>
                      <div className="text-right">
                        {user.cricketProfile?.preferredRole?.map((role, i) => (
                          <span key={i} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs ml-1 mb-1">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Batting Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Matches</span>
                      <span className="font-medium text-gray-800">{user.cricketProfile?.matchesPlayed || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Total Runs</span>
                      <span className="font-medium text-gray-800">{user.cricketProfile?.totalRuns || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Batting Average</span>
                      <span className="font-medium text-gray-800">{user.cricketProfile?.battingAverage || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Highest Score</span>
                      <span className="font-medium text-gray-800">{user.cricketProfile?.highestScore || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Centuries</span>
                      <span className="font-medium text-gray-800">{user.cricketProfile?.centuries || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Half Centuries</span>
                      <span className="font-medium text-gray-800">{user.cricketProfile?.halfCenturies || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-3">Bowling Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Wickets</p>
                      <p className="text-2xl font-bold text-gray-900">{user.cricketProfile?.totalWickets || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Bowling Average</p>
                      <p className="text-2xl font-bold text-gray-900">{user.cricketProfile?.bowlingAverage || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">5-Wicket Hauls</p>
                      <p className="text-2xl font-bold text-gray-900">{user.cricketProfile?.fiveWicketHauls || 0}</p>
                    </div>
                  </div>
                  
                  {user.cricketProfile?.bestBowlingFigures && (
                    <div className="mt-4 bg-primary-50 p-4 rounded-lg">
                      <p className="text-sm text-primary-600 mb-1">Best Bowling Figures</p>
                      <p className="text-xl font-bold text-primary-700">
                        {user.cricketProfile.bestBowlingFigures.wickets}/{user.cricketProfile.bestBowlingFigures.runs}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Career Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Match Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Matches Played</span>
                      <span className="font-medium text-gray-800">{user.stats?.matchesPlayed || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Matches Won</span>
                      <span className="font-medium text-gray-800">{user.stats?.matchesWon || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Matches Lost</span>
                      <span className="font-medium text-gray-800">{user.stats?.matchesLost || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Win Rate</span>
                      <span className="font-medium text-gray-800">
                        {user.stats?.matchesPlayed 
                          ? ((user.stats.matchesWon / user.stats.matchesPlayed) * 100).toFixed(1) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Tournament Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Tournaments Played</span>
                      <span className="font-medium text-gray-800">{user.stats?.tournamentsPlayed || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Tournaments Won</span>
                      <span className="font-medium text-gray-800">{user.stats?.tournamentsWon || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Man of the Match</span>
                      <span className="font-medium text-gray-800">{user.stats?.manOfTheMatch || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Man of the Series</span>
                      <span className="font-medium text-gray-800">{user.stats?.manOfTheSeries || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              
              {user.loginHistory && user.loginHistory.length > 0 ? (
                <div className="space-y-4">
                  {user.loginHistory.slice(0, 10).map((login, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Login Activity</p>
                        <p className="text-sm text-gray-500">
                          {login.ipAddress || 'IP not recorded'} • {login.deviceInfo || 'Unknown device'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {login.loginAt ? formatDate(login.loginAt) : 'Date not available'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No recent activity found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewUser