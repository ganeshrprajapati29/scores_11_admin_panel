import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { matchService } from '../../services/match.service';
import { scoringService } from '../../services/scoring.service';
import { Loader, Table, Button } from '../../components/common';
import { classNames } from '../../utils/helpers.js';
import { LayoutDashboard, Activity, Trophy, Users, Clock } from 'lucide-react';

const LiveScorecards = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const { socket, connected, joinLiveMatchRooms, leaveLiveMatchRooms } = useSocket();

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  useEffect(() => {
    if (socket && liveMatches.length > 0) {
      const matchIds = liveMatches.map(m => m._id);
      joinLiveMatchRooms(matchIds);

      socket.on('liveScoreUpdate', handleLiveUpdate);

      return () => {
        leaveLiveMatchRooms(matchIds);
        socket.off('liveScoreUpdate', handleLiveUpdate);
      };
    }
  }, [socket, liveMatches]);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await matchService.getLiveMatches();
      setLiveMatches(response);
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveUpdate = (data) => {
    setLiveMatches(prev => 
      prev.map(match => 
        match._id === data.matchId 
          ? { ...match, ...data.score, currentInnings: data.currentInnings }
          : match
      )
    );
  };

  const toggleMatch = async (matchId) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
    } else {
      setExpandedMatch(matchId);
      // Fetch detailed scorecard
      try {
        const response = await scoringService.getLiveScore(matchId);
        const scorecard = response || {};
        
        // Update local state with detailed data
        setLiveMatches(prev => 
          prev.map(match => match._id === matchId 
            ? { 
                ...match, 
                scorecard: {
                  score: scorecard.score || match.score || {},
                  currentInnings: scorecard.scorecard || { runs: 0, wickets: 0, overs: '0.0', battingScorecard: [], bowlingScorecard: [] },
                  ...scorecard
                }
              }
            : match
          )
        );
      } catch (error) {
        console.error(`Failed to fetch scorecard for match ${matchId}:`, error);
        // Set empty scorecard to avoid UI break
        setLiveMatches(prev => 
          prev.map(match => match._id === matchId 
            ? { 
                ...match, 
                scorecard: {
                  score: match.score || { team1: {}, team2: {} },
                  currentInnings: { runs: 0, wickets: 0, overs: '0.0', battingScorecard: [], bowlingScorecard: [] }
                }
              }
            : match
          )
        );
      }
    }
  };

  if (loading) return <Loader text="Loading live matches..." />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Activity className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Scorecards Dashboard</h1>
          <p className="text-gray-500">
            {connected ? '🔴 Live' : '⚫ Offline'} | {liveMatches.length} active matches
          </p>
        </div>
        <Button onClick={fetchLiveMatches} variant="outline" size="sm">
          <Clock className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {liveMatches.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Live Matches</h3>
          <p className="text-gray-500">All matches are either completed or scheduled.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {liveMatches.map((match) => (
            <div key={match._id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              {/* Match Header */}
              <div 
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => toggleMatch(match._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <img 
                        src={match.team1?.logo || '/placeholder-team.png'} 
                        alt={match.team1?.name} 
                        className="w-12 h-12 rounded-full border-3 border-white shadow-md"
                      />
                      <img 
                        src={match.team2?.logo || '/placeholder-team.png'} 
                        alt={match.team2?.name} 
                        className="w-12 h-12 rounded-full border-3 border-white shadow-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">
                        {match.team1?.name || 'Team 1'} vs {match.team2?.name || 'Team 2'}
                      </h3>
                      <p className="text-sm text-gray-500">{match.venue?.name || 'Unknown Venue'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {match.score?.team1?.runs || 0}/{match.score?.team1?.wickets || 0}
                      <span className="text-sm font-normal"> ({match.score?.team1?.overs || '0.0'})</span>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">
                      {match.status} | Innings {match.currentInnings || 1}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Scorecard */}
              {expandedMatch === match._id && (
                <div className="p-6 bg-gray-50">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Current Score */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Current Score
                      </h4>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-gray-900">
                          {match.scorecard?.score?.team1?.runs || 0}/{match.scorecard?.score?.team1?.wickets || 0}
                        </div>
                        <div className="text-lg text-gray-500">
                          ({match.scorecard?.currentInnings?.overs || '0.0'}) overs
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>RR: {match.scorecard?.currentInnings?.runRate || '0.00'}</span>
                          <span>Extras: {match.scorecard?.currentInnings?.extras?.total || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Batsmen */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Batsmen
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {match.scorecard?.currentInnings?.battingScorecard?.slice(0, 4).map((batsman, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{batsman.batsmanName || 'Batsman'}</span>
                            <span className="font-mono">{batsman.runs}/{batsman.balls}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bowlers */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-orange-600" />
                        Bowlers
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {match.scorecard?.currentInnings?.bowlingScorecard?.slice(0, 4).map((bowler, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{bowler.bowlerName || 'Bowler'}</span>
                            <span className="font-mono">{bowler.economy?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Controls</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" onClick={() => {}}>
                        Add Ball (1)
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {}}>
                        Wicket
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {}}>
                        Four
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {}}>
                        Six
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {}}>
                        Wide
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Connection Status */}
      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg border">
        <div className={classNames(
          "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
          connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>
    </div>
  )
}

export default LiveScorecards

