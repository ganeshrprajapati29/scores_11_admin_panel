import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, User, Mail, Phone, Calendar, MapPin, 
  Activity, Award, Shield, Globe, Settings, Bell, Eye,
  Lock, Camera, FileText, Users, Target, Star, Trophy,
  CheckCircle, XCircle
} from 'lucide-react'
import { usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('basic') // basic, cricket, preferences, stats, security
  
  const [formData, setFormData] = useState({
    // Basic Information
    email: '',
    username: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    bio: '',
    role: 'user',
    
    // Location
    location: {
      city: '',
      state: '',
      country: '',
      coordinates: [0, 0]
    },
    
    // Cricket Profile
    cricketProfile: {
      playerType: '',
      battingStyle: '',
      bowlingStyle: 'none',
      preferredRole: [],
      battingAverage: 0,
      bowlingAverage: 0,
      highestScore: 0,
      bestBowlingFigures: {
        wickets: 0,
        runs: 0
      },
      matchesPlayed: 0,
      totalRuns: 0,
      totalWickets: 0,
      centuries: 0,
      halfCenturies: 0,
      fiveWicketHauls: 0
    },
    
    // Stats
    stats: {
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      tournamentsPlayed: 0,
      tournamentsWon: 0,
      manOfTheMatch: 0,
      manOfTheSeries: 0
    },
    
    // Avatar
    avatar: {
      url: '',
      publicId: ''
    },
    
    // Preferences
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        showProfile: true,
        showStats: true,
        showLocation: false
      },
      language: 'en',
      theme: 'system'
    },
    
    // Account Status
    isEmailVerified: false,
    isPhoneVerified: false,
    isProfileComplete: false,
    isActive: true,
    isBlocked: false,
    blockedReason: '',
    
    // Level & Experience
    level: 1,
    experiencePoints: 0,
    title: 'Rookie',
    
    // Referral
    referralCode: '',
    referralEarnings: 0
  })

  useEffect(() => {
    if (id) {
      fetchUser()
    }
  }, [id])

  const fetchUser = async () => {
    try {
      setInitialLoading(true)
      const response = await usersAPI.getById(id)
      const userData = response.data || response
      
      // Map the response data to formData structure
      setFormData({
        // Basic Information
        email: userData.email || '',
        username: userData.username || '',
        fullName: userData.fullName || userData.name || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        gender: userData.gender || 'prefer-not-to-say',
        bio: userData.bio || '',
        role: userData.role || 'user',
        
        // Location
        location: {
          city: userData.location?.city || '',
          state: userData.location?.state || '',
          country: userData.location?.country || '',
          coordinates: userData.location?.coordinates || [0, 0]
        },
        
        // Cricket Profile
        cricketProfile: {
          playerType: userData.cricketProfile?.playerType || '',
          battingStyle: userData.cricketProfile?.battingStyle || '',
          bowlingStyle: userData.cricketProfile?.bowlingStyle || 'none',
          preferredRole: userData.cricketProfile?.preferredRole || [],
          battingAverage: userData.cricketProfile?.battingAverage || 0,
          bowlingAverage: userData.cricketProfile?.bowlingAverage || 0,
          highestScore: userData.cricketProfile?.highestScore || 0,
          bestBowlingFigures: {
            wickets: userData.cricketProfile?.bestBowlingFigures?.wickets || 0,
            runs: userData.cricketProfile?.bestBowlingFigures?.runs || 0
          },
          matchesPlayed: userData.cricketProfile?.matchesPlayed || 0,
          totalRuns: userData.cricketProfile?.totalRuns || 0,
          totalWickets: userData.cricketProfile?.totalWickets || 0,
          centuries: userData.cricketProfile?.centuries || 0,
          halfCenturies: userData.cricketProfile?.halfCenturies || 0,
          fiveWicketHauls: userData.cricketProfile?.fiveWicketHauls || 0
        },
        
        // Stats
        stats: {
          matchesPlayed: userData.stats?.matchesPlayed || 0,
          matchesWon: userData.stats?.matchesWon || 0,
          matchesLost: userData.stats?.matchesLost || 0,
          tournamentsPlayed: userData.stats?.tournamentsPlayed || 0,
          tournamentsWon: userData.stats?.tournamentsWon || 0,
          manOfTheMatch: userData.stats?.manOfTheMatch || 0,
          manOfTheSeries: userData.stats?.manOfTheSeries || 0
        },
        
        // Avatar
        avatar: {
          url: userData.avatar?.url || '',
          publicId: userData.avatar?.publicId || ''
        },
        
        // Preferences
        preferences: {
          notifications: {
            email: userData.preferences?.notifications?.email ?? true,
            push: userData.preferences?.notifications?.push ?? true,
            sms: userData.preferences?.notifications?.sms ?? false
          },
          privacy: {
            showProfile: userData.preferences?.privacy?.showProfile ?? true,
            showStats: userData.preferences?.privacy?.showStats ?? true,
            showLocation: userData.preferences?.privacy?.showLocation ?? false
          },
          language: userData.preferences?.language || 'en',
          theme: userData.preferences?.theme || 'system'
        },
        
        // Account Status
        isEmailVerified: userData.isEmailVerified || false,
        isPhoneVerified: userData.isPhoneVerified || false,
        isProfileComplete: userData.isProfileComplete || false,
        isActive: userData.isActive ?? true,
        isBlocked: userData.isBlocked || false,
        blockedReason: userData.blockedReason || '',
        
        // Level & Experience
        level: userData.level || 1,
        experiencePoints: userData.experiencePoints || 0,
        title: userData.title || 'Rookie',
        
        // Referral
        referralCode: userData.referralCode || '',
        referralEarnings: userData.referralEarnings || 0
      })
    } catch (error) {
      console.error('Fetch user error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch user')
      navigate('/admin/users')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      // Handle nested objects
      const [parent, child] = name.split('.')
      if (parent.includes('[')) {
        // Handle array fields like bestBowlingFigures
        const match = name.match(/(\w+)\.(\w+)\.(\w+)/)
        if (match) {
          const [_, mainParent, subParent, subChild] = match
          setFormData(prev => ({
            ...prev,
            [mainParent]: {
              ...prev[mainParent],
              [subParent]: {
                ...prev[mainParent]?.[subParent],
                [subChild]: type === 'checkbox' ? checked : value
              }
            }
          }))
        }
      } else {
        // Handle regular nested objects
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }))
      }
    } else if (name.includes('[')) {
      // Handle array notation
      const match = name.match(/(\w+)\[(\w+)\]\.(\w+)/)
      if (match) {
        const [_, parent, index, child] = match
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }))
      }
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handlePreferredRoleChange = (role) => {
    setFormData(prev => {
      const currentRoles = prev.cricketProfile.preferredRole || []
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter(r => r !== role)
        : [...currentRoles, role]
      
      return {
        ...prev,
        cricketProfile: {
          ...prev.cricketProfile,
          preferredRole: newRoles
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Clean up the data before sending
      const updateData = {
        ...formData,
        // Remove empty strings for numbers
        experiencePoints: Number(formData.experiencePoints) || 0,
        level: Number(formData.level) || 1,
        referralEarnings: Number(formData.referralEarnings) || 0,
        
        // Ensure nested objects are properly structured
        location: {
          city: formData.location.city || '',
          state: formData.location.state || '',
          country: formData.location.country || '',
          coordinates: formData.location.coordinates || [0, 0]
        },
        
        cricketProfile: {
          ...formData.cricketProfile,
          battingAverage: Number(formData.cricketProfile.battingAverage) || 0,
          bowlingAverage: Number(formData.cricketProfile.bowlingAverage) || 0,
          highestScore: Number(formData.cricketProfile.highestScore) || 0,
          matchesPlayed: Number(formData.cricketProfile.matchesPlayed) || 0,
          totalRuns: Number(formData.cricketProfile.totalRuns) || 0,
          totalWickets: Number(formData.cricketProfile.totalWickets) || 0,
          centuries: Number(formData.cricketProfile.centuries) || 0,
          halfCenturies: Number(formData.cricketProfile.halfCenturies) || 0,
          fiveWicketHauls: Number(formData.cricketProfile.fiveWicketHauls) || 0,
          bestBowlingFigures: {
            wickets: Number(formData.cricketProfile.bestBowlingFigures?.wickets) || 0,
            runs: Number(formData.cricketProfile.bestBowlingFigures?.runs) || 0
          }
        },
        
        stats: {
          matchesPlayed: Number(formData.stats.matchesPlayed) || 0,
          matchesWon: Number(formData.stats.matchesWon) || 0,
          matchesLost: Number(formData.stats.matchesLost) || 0,
          tournamentsPlayed: Number(formData.stats.tournamentsPlayed) || 0,
          tournamentsWon: Number(formData.stats.tournamentsWon) || 0,
          manOfTheMatch: Number(formData.stats.manOfTheMatch) || 0,
          manOfTheSeries: Number(formData.stats.manOfTheSeries) || 0
        }
      }
      
      await usersAPI.update(id, updateData)
      toast.success('User updated successfully')
      navigate('/admin/users')
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-500 mt-1">
            Editing: {formData.fullName || formData.email}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <nav className="flex gap-1 px-4">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="inline w-4 h-4 mr-2" />
            Basic Info
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
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="inline w-4 h-4 mr-2" />
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="inline w-4 h-4 mr-2" />
            Security & Status
          </button>
        </nav>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar Preview */}
              <div className="md:col-span-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                  {formData.avatar?.url ? (
                    <img 
                      src={formData.avatar.url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100">
                      <User className="w-8 h-8 text-primary-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{formData.fullName}</h3>
                  <p className="text-sm text-gray-500">@{formData.username}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="user">User</option>
                  <option value="player">Player</option>
                  <option value="captain">Captain</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Write a short bio..."
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-900 mb-4">Location</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cricket Profile Tab */}
          {activeTab === 'cricket' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Type
                </label>
                <select
                  name="cricketProfile.playerType"
                  value={formData.cricketProfile.playerType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Player Type</option>
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All-rounder</option>
                  <option value="wicket-keeper">Wicket-keeper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batting Style
                </label>
                <select
                  name="cricketProfile.battingStyle"
                  value={formData.cricketProfile.battingStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Batting Style</option>
                  <option value="right-hand">Right Hand</option>
                  <option value="left-hand">Left Hand</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bowling Style
                </label>
                <select
                  name="cricketProfile.bowlingStyle"
                  value={formData.cricketProfile.bowlingStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="none">None</option>
                  <option value="right-arm-fast">Right Arm Fast</option>
                  <option value="right-arm-medium">Right Arm Medium</option>
                  <option value="left-arm-fast">Left Arm Fast</option>
                  <option value="left-arm-medium">Left Arm Medium</option>
                  <option value="spin">Spin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'opener', 'top-order', 'middle-order', 
                    'finisher', 'spinner', 'fast-bowler', 
                    'swing-bowler', 'death-over-specialist'
                  ].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handlePreferredRoleChange(role)}
                      className={`px-3 py-1.5 rounded-lg text-sm border ${
                        formData.cricketProfile.preferredRole?.includes(role)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {role.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-900 mb-4">Career Statistics</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matches Played
                </label>
                <input
                  type="number"
                  name="cricketProfile.matchesPlayed"
                  value={formData.cricketProfile.matchesPlayed}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Runs
                </label>
                <input
                  type="number"
                  name="cricketProfile.totalRuns"
                  value={formData.cricketProfile.totalRuns}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Wickets
                </label>
                <input
                  type="number"
                  name="cricketProfile.totalWickets"
                  value={formData.cricketProfile.totalWickets}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batting Average
                </label>
                <input
                  type="number"
                  name="cricketProfile.battingAverage"
                  value={formData.cricketProfile.battingAverage}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bowling Average
                </label>
                <input
                  type="number"
                  name="cricketProfile.bowlingAverage"
                  value={formData.cricketProfile.bowlingAverage}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highest Score
                </label>
                <input
                  type="number"
                  name="cricketProfile.highestScore"
                  value={formData.cricketProfile.highestScore}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Centuries
                </label>
                <input
                  type="number"
                  name="cricketProfile.centuries"
                  value={formData.cricketProfile.centuries}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Half Centuries
                </label>
                <input
                  type="number"
                  name="cricketProfile.halfCenturies"
                  value={formData.cricketProfile.halfCenturies}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Five Wicket Hauls
                </label>
                <input
                  type="number"
                  name="cricketProfile.fiveWicketHauls"
                  value={formData.cricketProfile.fiveWicketHauls}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Bowling - Wickets
                </label>
                <input
                  type="number"
                  name="cricketProfile.bestBowlingFigures.wickets"
                  value={formData.cricketProfile.bestBowlingFigures?.wickets}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Bowling - Runs
                </label>
                <input
                  type="number"
                  name="cricketProfile.bestBowlingFigures.runs"
                  value={formData.cricketProfile.bestBowlingFigures?.runs}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h3 className="font-medium text-gray-900 mb-4">Match Statistics</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matches Played
                </label>
                <input
                  type="number"
                  name="stats.matchesPlayed"
                  value={formData.stats.matchesPlayed}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matches Won
                </label>
                <input
                  type="number"
                  name="stats.matchesWon"
                  value={formData.stats.matchesWon}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matches Lost
                </label>
                <input
                  type="number"
                  name="stats.matchesLost"
                  value={formData.stats.matchesLost}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournaments Played
                </label>
                <input
                  type="number"
                  name="stats.tournamentsPlayed"
                  value={formData.stats.tournamentsPlayed}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournaments Won
                </label>
                <input
                  type="number"
                  name="stats.tournamentsWon"
                  value={formData.stats.tournamentsWon}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Man of the Match
                </label>
                <input
                  type="number"
                  name="stats.manOfTheMatch"
                  value={formData.stats.manOfTheMatch}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Man of the Series
                </label>
                <input
                  type="number"
                  name="stats.manOfTheSeries"
                  value={formData.stats.manOfTheSeries}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-3">
                <h3 className="font-medium text-gray-900 mb-4">Level & Experience</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <input
                  type="number"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Points
                </label>
                <input
                  type="number"
                  name="experiencePoints"
                  value={formData.experiencePoints}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  readOnly
                />
              </div>

              <div className="md:col-span-3">
                <h3 className="font-medium text-gray-900 mb-4">Referral Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Code
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referral Earnings
                </label>
                <input
                  type="number"
                  name="referralEarnings"
                  value={formData.referralEarnings}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.notifications.email"
                      checked={formData.preferences.notifications.email}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.notifications.push"
                      checked={formData.preferences.notifications.push}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Push Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.notifications.sms"
                      checked={formData.preferences.notifications.sms}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">SMS Notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.privacy.showProfile"
                      checked={formData.preferences.privacy.showProfile}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Show Profile to Others</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.privacy.showStats"
                      checked={formData.preferences.privacy.showStats}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Show Statistics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preferences.privacy.showLocation"
                      checked={formData.preferences.privacy.showLocation}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Show Location</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="preferences.language"
                    value={formData.preferences.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="te">Telugu</option>
                    <option value="ta">Tamil</option>
                    <option value="kn">Kannada</option>
                    <option value="ml">Malayalam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    name="preferences.theme"
                    value={formData.preferences.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Security & Status Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isEmailVerified"
                        checked={formData.isEmailVerified}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-gray-700 flex items-center gap-1">
                        Email Verified
                        {formData.isEmailVerified ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPhoneVerified"
                        checked={formData.isPhoneVerified}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-gray-700 flex items-center gap-1">
                        Phone Verified
                        {formData.isPhoneVerified ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isProfileComplete"
                        checked={formData.isProfileComplete}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Profile Complete</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Account Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isBlocked"
                        checked={formData.isBlocked}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Account Blocked</span>
                    </label>
                  </div>
                </div>
              </div>

              {formData.isBlocked && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blocked Reason
                  </label>
                  <textarea
                    name="blockedReason"
                    value={formData.blockedReason}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Reason for blocking..."
                  />
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">User ID:</span>{' '}
                    <span className="text-gray-600">{id}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Avatar Public ID:</span>{' '}
                    <span className="text-gray-600">{formData.avatar.publicId || 'None'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUser