import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AssociationDetails = () => {
  const { id } = useParams();
  const [association, setAssociation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const response = await axios.get(`/api/associations/${id}`);
        setAssociation(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch association details');
        setLoading(false);
      }
    };
    fetchAssociation();
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
          <Link to="/associations" className="text-red-700 underline">Back to Associations</Link>
        </div>
      </div>
    );
  }

  if (!association) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link to="/associations" className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
          ← Back to Associations
        </Link>
      </div>

      {/* Association Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {association.coverImage?.url && (
            <img 
              src={association.coverImage.url} 
              alt="" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              {association.logo?.url ? (
                <img 
                  src={association.logo.url} 
                  alt={association.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-600 mx-auto">
                  {association.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{association.name}</h1>
              {association.shortName && (
                <p className="text-gray-500">{association.shortName}</p>
              )}
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                association.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {association.isVerified ? '✓ Verified' : 'Pending'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                association.isActive 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {association.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {association.description && (
            <p className="mt-4 text-gray-600">{association.description}</p>
          )}

          {/* Location & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {association.location && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">📍 Location</h3>
                <p className="text-gray-600">
                  {[association.location.city, association.location.state, association.location.country]
                    .filter(Boolean)
                    .join(', ') || 'Not specified'}
                </p>
              </div>
            )}
            
            {association.contact && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">📞 Contact</h3>
                <div className="space-y-1 text-gray-600">
                  {association.contact.email && <p>✉️ {association.contact.email}</p>}
                  {association.contact.phone && <p>📱 {association.contact.phone}</p>}
                  {association.contact.website && <p>🌐 {association.contact.website}</p>}
                </div>
              </div>
            )}
          </div>

          {association.foundedYear && (
            <div className="mt-4">
              <span className="text-gray-500">Founded: </span>
              <span className="text-gray-800 font-medium">{association.foundedYear}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            {['overview', 'clubs', 'tournaments', 'members'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                  label="Total Clubs" 
                  value={association.clubs?.length || 0} 
                  icon="🏏"
                />
                <StatCard 
                  label="Tournaments" 
                  value={association.tournaments?.length || 0} 
                  icon="🏆"
                />
                <StatCard 
                  label="Members" 
                  value={association.members?.length || 0} 
                  icon="👥"
                />
              </div>
              
              {/* Admin Info */}
              {association.admin && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Admin</h3>
                  <p className="text-gray-600">
                    {typeof association.admin === 'object' 
                      ? association.admin.name || association.admin.email 
                      : 'Admin User'}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(association.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date(association.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clubs' && (
            <div>
              {association.clubs && association.clubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {association.clubs.map((club) => (
                    <Link
                      key={club._id}
                      to={`/clubs/${club._id}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <h4 className="font-medium text-gray-800">{club.name}</h4>
                      <p className="text-sm text-gray-500">{club.location?.city || 'No location'}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No clubs registered yet.</p>
              )}
            </div>
          )}

          {activeTab === 'tournaments' && (
            <div>
              {association.tournaments && association.tournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {association.tournaments.map((tournament) => (
                    <Link
                      key={tournament._id}
                      to={`/tournaments/${tournament._id}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <h4 className="font-medium text-gray-800">{tournament.name}</h4>
                      <p className="text-sm text-gray-500">
                        {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : 'Date not set'}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tournaments organized yet.</p>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              {association.members && association.members.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Member</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {association.members.map((member, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          {member.user?.name || member.user?.email || 'Unknown'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No members yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Link
          to={`/associations/${id}/edit`}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Edit Association
        </Link>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon }) => (
  <div className="bg-gray-50 p-6 rounded-lg text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-gray-500">{label}</p>
  </div>
);

export default AssociationDetails;
