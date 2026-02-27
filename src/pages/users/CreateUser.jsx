import { useState, useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, User, Mail, Lock, Phone, Calendar, MapPin, 
  Activity, Award, Shield, Flag, Users, Target, Star,
  Camera, FileText, Globe, Settings, Bell, Eye
} from 'lucide-react'
import { usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateUser = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('basic') // basic, cricket, preferences, social

  // Set initial loading to false after component mounts to prevent infinite loading
  useEffect(() => {
    // Small timeout to ensure component is properly mounted
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  
  const [formData, setFormData] = useState({
    // Basic Information
    email: '',
    password: '',
    username: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    bio: '',
    
    // Role
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
    isActive: true,
    
    // Referral
    referralCode: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      // Handle nested objects
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else if (name.includes('[')) {
      // Handle array fields
      const match = name.match(/(\w+)\[(\w+)\]\.(\w+)/)
      if (match) {
        const [_, parent, index, child] = match
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
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
      const currentRoles = prev.cricketProfile.preferredRole
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
      
      // Auto-generate username if not provided
      if (!formData.username) {
        formData.username = formData.email.split('@')[0] + Math.floor(Math.random() * 1000)
      }
      
      await usersAPI.create(formData)
      toast.success('User created successfully')
      navigate('/users')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  // Show loading spinner during initial load
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/users" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
          <p className="text-gray-500">Add a new user with complete profile</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
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
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'cricket'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="inline w-4 h-4 mr-2" />
            Cricket Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'preferences'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="inline w-4 h-4 mr-2" />
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'social'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="inline w-4 h-4 mr-2" />
            Social & Stats
          </button>
        </nav>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Unique username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                  maxLength="500"
                />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location - City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="City"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location - State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location - Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Country"
                  />
                </div>
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
                  placeholder="Enter referral code"
                />
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
                <div className="flex flex-wrap gap-3">
                  {['opener', 'top-order', 'middle-order', 'finisher', 'spinner', 'fast-bowler'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handlePreferredRoleChange(role)}
                      className={`px-4 py-2 rounded-lg border ${
                        formData.cricketProfile.preferredRole.includes(role)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {role.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-700 mb-4">Career Statistics</h3>
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
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Notification Settings</h3>
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
                <h3 className="font-medium text-gray-700 mb-4">Privacy Settings</h3>
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

          {/* Social & Stats Tab */}
          {activeTab === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Man of the Match Awards
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
                  Man of the Series Awards
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

              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-700 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isEmailVerified"
                      checked={formData.isEmailVerified}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Email Verified</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPhoneVerified"
                      checked={formData.isPhoneVerified}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Phone Verified</span>
                  </label>
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
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link
              to="/users"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUser
