import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader } from '../../components/common/Loader';

const TournamentDetails = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch tournament details by ID
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/tournaments/${id}`);
        if (!response.ok) {
          throw new Error('Tournament not found');
        }
        const data = await response.json();
        setTournament(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!tournament) return <div className="p-8 text-center">Tournament not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
          <p className="text-gray-600 mt-2">{tournament.description}</p>
        </div>
        <div className="space-x-2">
          <Link to={`/tournaments/${id}/edit`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Tournament
          </Link>
          <Link to="/tournaments" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Back to List
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            tournament.status === 'active' ? 'bg-green-100 text-green-800' :
            tournament.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {tournament.status}
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Teams</h3>
          <span className="text-2xl font-bold text-gray-900">{tournament.teamCount || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Matches</h3>
          <span className="text-2xl font-bold text-gray-900">{tournament.matchCount || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Teams</h3>
          <div className="space-y-3">
            {tournament.teams?.slice(0, 5).map(team => (
              <Link 
                key={team.id} 
                to={`/teams/${team.id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                {team.name}
              </Link>
            )) || 'No teams'}
          </div>
          {tournament.teams?.length > 5 && (
            <Link to={`/tournaments/${id}/teams`} className="text-blue-600 hover:underline mt-4 inline-block">
              View All Teams
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Upcoming Matches</h3>
          <div className="space-y-3">
            {tournament.upcomingMatches?.slice(0, 3).map(match => (
              <Link 
                key={match.id}
                to={`/matches/${match.id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="font-medium">{match.team1} vs {match.team2}</div>
                <div className="text-sm text-gray-500">{match.date}</div>
              </Link>
            )) || 'No upcoming matches'}
          </div>
          <Link to={`/tournaments/${id}/matches`} className="text-blue-600 hover:underline mt-4 inline-block">
            View All Matches
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;

