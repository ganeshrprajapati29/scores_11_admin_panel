import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/admin.service';
import useAuth from "../../hooks/useAuth";

const AdminPlayersList = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isVerified: ''
  });
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, [pagination.page, filters]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
        ...(filters.isVerified && { isVerified: filters.isVerified })
      };
      const response = await adminService.getAllPlayers(params);
      setPlayers(response.data.data);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (playerId, verified) => {
    try {
      await adminService.verifyPlayer(playerId, verified);
      fetchPlayers();
    } catch (error) {
      console.error('Error verifying player:', error);
    }
  };

  const handleDelete = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await adminService.deletePlayer(playerId);
        fetchPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPlayers(players.map(p => p._id));
    } else {
      setSelectedPlayers([]);
    }
  };

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Player Management</h1>
        
        <Link
          to="/admin/players/merge"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Merge Duplicates
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search players..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="border p-2 rounded-lg"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="border p-2 rounded-lg"
          >
            <option value="">All Roles</option>
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all-rounder">All-Rounder</option>
            <option value="wicket-keeper">Wicket Keeper</option>
          </select>
          <select
            value={filters.isVerified}
            onChange={(e) => setFilters(prev => ({ ...prev, isVerified: e.target.value }))}
            className="border p-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <button
            onClick={() => setFilters({ search: '', role: '', isVerified: '' })}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPlayers.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center gap-4">
          <span>{selectedPlayers.length} players selected</span>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit Stats
          </button>
        </div>
      )}

      {/* Players Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
  <tr>
    <th className="p-4 text-left">
      <input
        type="checkbox"
        onChange={handleSelectAll}
        checked={
          (selectedPlayers?.length || 0) === (players?.length || 0) &&
          (players?.length || 0) > 0
        }
      />
    </th>

    <th className="p-4 text-left">Player Name</th>
    <th className="p-4 text-left">Role</th>
    <th className="p-4 text-left">Team</th>
    <th className="p-4 text-left">Stats</th>
    <th className="p-4 text-left">Status</th>
    <th className="p-4 text-left">Actions</th>
  </tr>
</thead>
          <tbody>
  {loading ? (
    <tr>
      <td colSpan="7" className="p-4 text-center">Loading...</td>
    </tr>
  ) : (players?.length || 0) === 0 ? (
    <tr>
      <td colSpan="7" className="p-4 text-center">No players found</td>
    </tr>
  ) : (
    (players || []).map((player) => (
      <tr key={player?._id} className="border-t hover:bg-gray-50">
        <td className="p-4">
          <input
            type="checkbox"
            checked={selectedPlayers?.includes(player?._id)}
            onChange={() => handleSelectPlayer(player?._id)}
          />
        </td>

        <td className="p-4">
          <div>
            <div className="font-medium">{player?.playerName || "N/A"}</div>
            <div className="text-sm text-gray-500">
              {player?.user?.name || "No user"}
            </div>
          </div>
        </td>

        <td className="p-4 capitalize">{player?.role || "-"}</td>

        <td className="p-4">
          {player?.team ? (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {player?.team?.name}
            </span>
          ) : (
            <span className="text-gray-400">No team</span>
          )}
        </td>

        <td className="p-4">
          <div className="text-sm">
            <div>Runs: {player?.battingStats?.runs || 0}</div>
            <div>Wickets: {player?.bowlingStats?.wickets || 0}</div>
          </div>
        </td>

        <td className="p-4">
          {player?.isVerified ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Verified
            </span>
          ) : (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Pending
            </span>
          )}
        </td>

        <td className="p-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleVerify(player?._id, !player?.isVerified)}
              className={`px-2 py-1 rounded text-sm ${
                player?.isVerified
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              }`}
            >
              {player?.isVerified ? "Unverify" : "Verify"}
            </button>

            <Link
              to={`/admin/players/${player?._id}/stats`}
              className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200"
            >
              Edit
            </Link>

            <button
              onClick={() => handleDelete(player?._id)}
              className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPlayersList;

