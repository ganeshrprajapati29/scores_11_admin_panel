import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TeamLeaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/leaderboard/teams");

      console.log("API Response:", response.data);

      setTeams(response?.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Leaderboard Error:", err);
      setError(err.response?.data?.message || "Failed to fetch team leaderboard");
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-400 text-yellow-900";
    if (rank === 2) return "bg-gray-300 text-gray-700";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-gray-100 text-gray-600";
  };

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <Link
          to="/leaderboard"
          className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Leaderboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Team Leaderboard
        </h1>

        <p className="text-gray-600">
          Top performing teams ranked by performance
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>

        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700">{error}</div>

        ) : (

          <table className="w-full">

            {/* Table Head */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rank
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Team
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matches
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Won
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lost
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Points
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Win %
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">

              {teams.map((team, index) => {

                const rank = team.rank || index + 1;
                const matches = team.matchesPlayed || team.stats?.matchesPlayed || 0;
                const won = team.matchesWon || team.stats?.matchesWon || 0;
                const lost = team.matchesLost || team.stats?.matchesLost || 0;
                const points = won * 2;

                return (
                  <tr key={team._id || index} className="hover:bg-gray-50">

                    {/* Rank */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${getRankColor(rank)}`}
                      >
                        {getMedal(rank)}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{team.name}</p>
                        <p className="text-sm text-gray-500">
                          {team.shortName} • {team.city}
                        </p>
                      </div>
                    </td>

                    {/* Matches */}
                    <td className="px-6 py-4 text-gray-600">
                      {matches}
                    </td>

                    {/* Won */}
                    <td className="px-6 py-4 text-green-600 font-medium">
                      {won}
                    </td>

                    {/* Lost */}
                    <td className="px-6 py-4 text-red-600 font-medium">
                      {lost}
                    </td>

                    {/* Points */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-gray-900">
                        {points}
                      </span>
                    </td>

                    {/* Win Percentage */}
                    <td className="px-6 py-4 text-gray-600">
                      {team.winPercentage || "0.00"}%
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <Link
                        to={`/teams/${team._id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View Team
                      </Link>
                    </td>

                  </tr>
                );

              })}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};

export default TeamLeaderboard;