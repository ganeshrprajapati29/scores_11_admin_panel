import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`/api/players/${id}`);
        setPlayer(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch player details');
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
        </div>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link to="/players" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
          ← Back to Players
        </Link>
      </div>

      {/* Player Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="md:flex">
          {/* Avatar Section */}
          <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col items-center justify-center">
            {player.avatar?.url ? (
              <img 
                src={player.avatar.url} 
                alt={player.playerName}
                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center text-6xl font-bold text-gray-600">
                {player.playerName?.charAt(0)}
              </div>
            )}
            <h2 className="text-3xl font-bold text-white mt-4">{player.playerName}</h2>
            <p className="text-white/80">Jersey #{player.jerseyNumber}</p>
            <span className="mt-3 px-4 py-1 bg-white/20 rounded-full text-white capitalize">
              {player.role}
            </span>
          </div>

          {/* Details Section */}
          <div className="md:w-2/3 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Batting Style</h3>
                <p className="text-lg text-gray-900">{player.battingStyle}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Bowling Style</h3>
                <p className="text-lg text-gray-900">{player.bowlingStyle}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Date of Birth</h3>
                <p className="text-lg text-gray-900">
                  {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Place of Birth</h3>
                <p className="text-lg text-gray-900">{player.placeOfBirth || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Height</h3>
                <p className="text-lg text-gray-900">{player.height || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Weight</h3>
                <p className="text-lg text-gray-900">{player.weight || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Team</h3>
                <p className="text-lg text-gray-900">
                  {player.team?.name || 'Not Assigned'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  player.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {player.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Bio */}
            {player.bio && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bio</h3>
                <p className="text-gray-700">{player.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batting Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🏏 Batting Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Matches" value={player.battingStats?.matches || 0} />
            <StatCard label="Innings" value={player.battingStats?.innings || 0} />
            <StatCard label="Runs" value={player.battingStats?.runs || 0} />
            <StatCard label="Highest Score" value={player.battingStats?.highestScore || 0} />
            <StatCard label="Average" value={player.battingStats?.average?.toFixed(2) || 0} />
            <StatCard label="Strike Rate" value={player.battingStats?.strikeRate?.toFixed(2) || 0} />
            <StatCard label="Fifties" value={player.battingStats?.fifties || 0} />
            <StatCard label="Centuries" value={player.battingStats?.centuries || 0} />
            <StatCard label="Fours" value={player.battingStats?.fours || 0} />
            <StatCard label="Sixes" value={player.battingStats?.sixes || 0} />
          </div>
        </div>

        {/* Bowling Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Bowling Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Matches" value={player.bowlingStats?.matches || 0} />
            <StatCard label="Innings" value={player.bowlingStats?.innings || 0} />
            <StatCard label="Wickets" value={player.bowlingStats?.wickets || 0} />
            <StatCard label="Runs Conceded" value={player.bowlingStats?.runsConceded || 0} />
            <StatCard label="Overs" value={player.bowlingStats?.overs || 0} />
            <StatCard label="Economy" value={player.bowlingStats?.economy?.toFixed(2) || 0} />
            <StatCard label="Best Figures" value={`${player.bowlingStats?.bestFigures?.wickets || 0}/${player.bowlingStats?.bestFigures?.runs || 0}`} />
            <StatCard label="5 Wickets" value={player.bowlingStats?.fiveWickets || 0} />
          </div>
        </div>

        {/* Fielding Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🧤 Fielding Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Catches" value={player.fieldingStats?.catches || 0} />
            <StatCard label="Stumpings" value={player.fieldingStats?.stumpings || 0} />
            <StatCard label="Run Outs" value={player.fieldingStats?.runOuts || 0} />
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            ✓ Verification Status
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Verified Player</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                player.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {player.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Player ID</span>
              <span className="text-gray-800 font-mono">{player._id}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Created At</span>
              <span className="text-gray-800">
                {new Date(player.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Link
          to={`/players/${id}/edit`}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Edit Player
        </Link>
        <Link
          to={`/leaderboard/players?player=${id}`}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          View in Leaderboard
        </Link>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

export default PlayerDetails;
