import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { playersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

<<<<<<< HEAD
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await playersAPI.getById(id);
        setPlayer(response.data || response); // Handle ApiResponse wrapper
      } catch (err) {
        const errorMsg = err.message || 'Failed to fetch player details';
        setError(errorMsg);
        toast.error(errorMsg);
        console.error('Player fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto h-12 w-12 text-primary-600" />
          <p className="mt-4 text-gray-600">Loading player details...</p>
=======
 useEffect(() => {

  const fetchPlayer = async () => {

    if (!id) return;

    try {

      setLoading(true);

      const response = await axios.get(`/api/players/${id}`);

      console.log("PLAYER API RESPONSE:", response.data);

      const playerData =
        response?.data?.data ||
        response?.data?.player ||
        response?.data ||
        null;

      setPlayer(playerData);

    } catch (err) {

      console.error("PLAYER FETCH ERROR:", err);

      setError(
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch player details"
      );

    } finally {

      setLoading(false);

    }

  };

  fetchPlayer();

}, [id]);

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <Link to="/players" className="text-red-700 underline">Back to Players</Link>
>>>>>>> origin/sumit
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error loading player</h2>
          <p>{error || 'Player not found'}</p>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => navigate('/players')} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Players
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = player.playerName || player.user?.name || 'Unknown Player';
  const displayEmail = player.user?.email || 'N/A';
  const displayPhone = player.user?.phone || 'N/A';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/players')} 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          <ArrowLeft size={20} />
          Back to Players
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-gray-500 mt-1">Player ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{player._id}</span></p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/players/${id}/edit`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Edit Player
            </Link>
            <Link
              to={`/leaderboard/players?player=${id}`}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Avatar Section */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex flex-col items-center justify-center text-white">
              {player.avatar?.url ? (
                <img 
                  src={player.avatar.url} 
                  alt={displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4 text-center">{displayName}</h2>
              <span className="mt-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm capitalize font-semibold">
                {player.role || 'Player'}
              </span>
              {player.team && (
                <span className="mt-3 px-3 py-1 bg-white/20 rounded-full text-sm">
                  {player.team.name}
                </span>
              )}
            </div>

            {/* Basic Info */}
            <div className="md:w-2/3 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact</h3>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-gray-900">{displayEmail}</p>
                    {displayPhone !== 'N/A' && (
                      <p className="text-sm text-gray-600">{displayPhone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      player.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {player.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      player.isVerified 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {player.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                {player.jerseyNumber && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Jersey #</h3>
                    <p className="text-2xl font-bold text-gray-900">{player.jerseyNumber}</p>
                  </div>
                )}
                {player.battingStyle && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Batting</h3>
                    <p className="text-lg capitalize">{player.battingStyle}</p>
                  </div>
                )}
                {player.bowlingStyle && player.bowlingStyle !== 'none' && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bowling</h3>
                    <p className="text-lg capitalize">{player.bowlingStyle}</p>
                  </div>
                )}
                {player.dateOfBirth && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">DOB</h3>
                    <p className="text-lg">{new Date(player.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}
                {player.height && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Height</h3>
                    <p className="text-lg">{player.height}</p>
                  </div>
                )}
              </div>
              {player.bio && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">{player.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Statistics */}
        <div className="space-y-6">
          <BattingStatsCard stats={player.battingStats || {}} />
          <BowlingStatsCard stats={player.bowlingStats || {}} />
          <FieldingStatsCard stats={player.fieldingStats || {}} />
        </div>
=======
      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Link
          to={`/players/${id}/edit`}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Edit Player
        </Link>
        <Link
  to={`/leaderboard/players/${id}/teams`}
  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
>
  View in Leaderboard
</Link>
>>>>>>> origin/sumit
      </div>
    </div>
  );
};

// Stats Components
const StatsCard = ({ label, value, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
  </div>
);

const BattingStatsCard = ({ stats }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🏏 Batting Stats</h3>
    <div className="grid grid-cols-2 gap-4">
      <StatsCard label="Matches" value={stats.matches} />
      <StatsCard label="Runs" value={stats.runs} />
      <StatsCard label="Avg" value={stats.average?.toFixed(1)} />
      <StatsCard label="SR" value={stats.strikeRate?.toFixed(1)} />
      <StatsCard label="HS" value={stats.highestScore} />
      <StatsCard label="50s" value={stats.fifties} />
      <StatsCard label="100s" value={stats.centuries} />
    </div>
  </div>
);

const BowlingStatsCard = ({ stats }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🎯 Bowling Stats</h3>
    <div className="grid grid-cols-2 gap-4">
      <StatsCard label="Matches" value={stats.matches} />
      <StatsCard label="Wkts" value={stats.wickets} />
      <StatsCard label="Econ" value={stats.economy?.toFixed(2)} />
      <StatsCard label="Overs" value={stats.overs?.toFixed(1)} />
      <StatsCard label="Best" value={`${stats.bestFigures?.wickets || 0}/${stats.bestFigures?.runs || 0}`} />
    </div>
  </div>
);

const FieldingStatsCard = ({ stats }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🧤 Fielding Stats</h3>
    <div className="grid grid-cols-3 gap-4">
      <StatsCard label="Catches" value={stats.catches} />
      <StatsCard label="Stumpings" value={stats.stumpings} />
      <StatsCard label="Run Outs" value={stats.runOuts} />
    </div>
  </div>
);

export default PlayerDetails;

