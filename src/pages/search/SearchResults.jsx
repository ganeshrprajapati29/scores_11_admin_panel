import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  Search, Users, Trophy, Calendar, Activity, 
  User, ArrowRight, Loader
} from 'lucide-react'
import { searchAPI } from '../../services/search.service'
import DashboardLayout from '../../layout/DashboardLayout'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (query && query.length >= 2) {
      performSearch()
    }
  }, [query])

  const performSearch = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await searchAPI.search(query, 10)
      setResults(response.data)
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to fetch search results')
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (type, id) => {
    switch(type) {
      case 'user':
        return `/users/${id}`
      case 'team':
        return `/teams/${id}`
      case 'player':
        return `/players/${id}`
      case 'match':
        return `/matches/${id}`
      case 'tournament':
        return `/tournaments/${id}`
      default:
        return '#'
    }
  }

  const getIcon = (type) => {
    switch(type) {
      case 'user':
        return <User className="text-primary-600" size={20} />
      case 'team':
        return <Trophy className="text-blue-600" size={20} />
      case 'player':
        return <Activity className="text-green-600" size={20} />
      case 'match':
        return <Calendar className="text-purple-600" size={20} />
      case 'tournament':
        return <Trophy className="text-orange-600" size={20} />
      default:
        return <Search className="text-gray-600" size={20} />
    }
  }

  const getLabel = (type) => {
    switch(type) {
      case 'user':
        return 'User'
      case 'team':
        return 'Team'
      case 'player':
        return 'Player'
      case 'match':
        return 'Match'
      case 'tournament':
        return 'Tournament'
      default:
        return type
    }
  }

  const renderResults = (type, items) => {
    if (!items || items.length === 0) return null

    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {getIcon(type)}
          {getLabel(type)}s
          <span className="text-sm font-normal text-gray-500">({items.length})</span>
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {items.map((item) => (
            <Link
              key={item._id}
              to={handleResultClick(type, item._id)}
              className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {type === 'user' && (
                    item.avatar?.url ? (
                      <img src={item.avatar.url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <User className="text-gray-400" size={18} />
                    )
                  )}
                  {type === 'team' && (
                    item.logo?.url ? (
                      <img src={item.logo.url} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Trophy className="text-gray-400" size={18} />
                    )
                  )}
                  {type === 'player' && (
                    item.avatar?.url ? (
                      <img src={item.avatar.url} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Activity className="text-gray-400" size={18} />
                    )
                  )}
                  {type === 'match' && <Calendar className="text-gray-400" size={18} />}
                  {type === 'tournament' && <Trophy className="text-gray-400" size={18} />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {item.fullName || item.name || item.playerName || item.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {type === 'user' && `@${item.username}`}
                    {type === 'team' && item.city}
                    {type === 'player' && `#${item.jerseyNumber} • ${item.role}`}
                    {type === 'match' && `${item.venue} • ${item.status}`}
                    {type === 'tournament' && `${item.venue} • ${item.status}`}
                  </p>
                </div>
              </div>
              <ArrowRight className="text-gray-400" size={18} />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-500 mt-1">
            Showing results for "{query}"
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-primary-600 animate-spin" />
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && !error && results && (
          <>
            {results.total === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No results found for "{query}"</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try different keywords or check spelling
                </p>
              </div>
            ) : (
              <>
                {renderResults('user', results.users)}
                {renderResults('team', results.teams)}
                {renderResults('player', results.players)}
                {renderResults('match', results.matches)}
                {renderResults('tournament', results.tournaments)}
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default SearchResults
