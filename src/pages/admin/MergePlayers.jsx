import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/admin.service';

const MergePlayers = () => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrimary, setSelectedPrimary] = useState({});
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDuplicatePlayers();
      setDuplicates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrimary = (groupId, playerId) => {
    setSelectedPrimary(prev => ({
      ...prev,
      [groupId]: playerId
    }));
  };

  const handleMerge = async (groupId) => {
    const primaryId = selectedPrimary[groupId];
    const group = duplicates.find(g => g._id === groupId);
    if (!group || !primaryId) return;

    const secondaryIds = group.players
      .filter(p => p._id !== primaryId)
      .map(p => p._id);

    if (secondaryIds.length === 0) {
      alert('Please select at least one player to merge');
      return;
    }

    if (!window.confirm(`Merge ${secondaryIds.length} players into the primary player?`)) {
      return;
    }

    try {
      setMerging(true);
      await adminService.mergePlayers({
        primaryPlayerId: primaryId,
        duplicatePlayerIds: secondaryIds
      });
      fetchDuplicates();
      setSelectedPrimary(prev => {
        const newState = { ...prev };
        delete newState[groupId];
        return newState;
      });
    } catch (error) {
      console.error('Error merging players:', error);
      alert('Failed to merge players');
    } finally {
      setMerging(false);
    }
  };

  const handleMergeAll = async () => {
    const groupsToMerge = duplicates.filter(group => selectedPrimary[group._id]);
    
    if (groupsToMerge.length === 0) {
      alert('Please select a primary player for each group');
      return;
    }

    if (!window.confirm(`Merge ${groupsToMerge.length} groups of players?`)) {
      return;
    }

    try {
      setMerging(true);
      for (const group of groupsToMerge) {
        const primaryId = selectedPrimary[group._id];
        const secondaryIds = group.players
          .filter(p => p._id !== primaryId)
          .map(p => p._id);
        
        await adminService.mergePlayers({
          primaryPlayerId: primaryId,
          duplicatePlayerIds: secondaryIds
        });
      }
      fetchDuplicates();
      setSelectedPrimary({});
    } catch (error) {
      console.error('Error merging all players:', error);
      alert('Failed to merge some players');
    } finally {
      setMerging(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin/players" className="text-blue-600 hover:underline mb-2 inline-block">
            Back to Players
          </Link>
          <h1 className="text-2xl font-bold">Merge Duplicate Players</h1>
        </div>
        {duplicates.length > 0 && (
          <button
            onClick={handleMergeAll}
            disabled={merging || Object.keys(selectedPrimary).length === 0}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {merging ? 'Merging...' : 'Merge All Selected'}
          </button>
        )}
      </div>

      {duplicates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold mb-2">No Duplicate Players Found</h2>
          <p className="text-gray-600">All players in the system are unique.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((group) => (
            <div key={group._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Potential Duplicates ({group.players.length} players)
                </h3>
                <button
                  onClick={() => handleMerge(group._id)}
                  disabled={merging || !selectedPrimary[group._id]}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Merge This Group
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.players.map((player) => (
                  <div
                    key={player._id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPrimary[group._id] === player._id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectPrimary(group._id, player._id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name={`primary-${group._id}`}
                        checked={selectedPrimary[group._id] === player._id}
                        onChange={() => handleSelectPrimary(group._id, player._id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{player.playerName}</div>
                        <div className="text-sm text-gray-500">
                          Role: {player.role}
                        </div>
                        {player.team && (
                          <div className="text-sm text-gray-500">
                            Team: {player.team.name}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Stats: {player.battingStats?.runs || 0} runs, {player.bowlingStats?.wickets || 0} wickets
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                <strong>Note:</strong> Select one player as the primary (keeper). All other players in this group 
                will be merged into the primary player, and their data will be combined.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MergePlayers;

