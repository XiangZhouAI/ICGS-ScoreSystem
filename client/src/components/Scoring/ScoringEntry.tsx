import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { theme } from '../../theme';
import { calculateCategory } from '../../utils/categoryUtils';

interface Player {
  id: string;
  name: string;
  handicap: number;
  gender: 'male' | 'female';
  category: 'A' | 'B' | 'C';
}

interface CourseHole {
  hole: number;
  par: number;
  strokeIndexMen: number;
  strokeIndexLadies: number;
  yardageMen: number;
  yardageLadies: number;
}

interface PlayerScore {
  playerId: string;
  scores: number[];
  totalScore: number;
  totalPoints: number;
  playingHandicap: number;
  front9Score: number;
  front9Points: number;
  back9Score: number;
  back9Points: number;
  back6Points: number;
  back3Points: number;
  back2Points: number;
  back1Points: number;
}

const COURSE_DATA: CourseHole[] = [
  { hole: 1, par: 4, strokeIndexMen: 7, strokeIndexLadies: 7, yardageMen: 398, yardageLadies: 329 },
  { hole: 2, par: 5, strokeIndexMen: 11, strokeIndexLadies: 3, yardageMen: 528, yardageLadies: 443 },
  { hole: 3, par: 4, strokeIndexMen: 3, strokeIndexLadies: 13, yardageMen: 405, yardageLadies: 323 },
  { hole: 4, par: 3, strokeIndexMen: 15, strokeIndexLadies: 17, yardageMen: 186, yardageLadies: 148 },
  { hole: 5, par: 4, strokeIndexMen: 1, strokeIndexLadies: 1, yardageMen: 410, yardageLadies: 344 },
  { hole: 6, par: 3, strokeIndexMen: 9, strokeIndexLadies: 15, yardageMen: 194, yardageLadies: 132 },
  { hole: 7, par: 4, strokeIndexMen: 5, strokeIndexLadies: 11, yardageMen: 410, yardageLadies: 330 },
  { hole: 8, par: 5, strokeIndexMen: 17, strokeIndexLadies: 5, yardageMen: 500, yardageLadies: 416 },
  { hole: 9, par: 4, strokeIndexMen: 13, strokeIndexLadies: 9, yardageMen: 378, yardageLadies: 342 },
  { hole: 10, par: 4, strokeIndexMen: 6, strokeIndexLadies: 2, yardageMen: 398, yardageLadies: 342 },
  { hole: 11, par: 4, strokeIndexMen: 16, strokeIndexLadies: 14, yardageMen: 345, yardageLadies: 265 },
  { hole: 12, par: 5, strokeIndexMen: 14, strokeIndexLadies: 10, yardageMen: 514, yardageLadies: 405 },
  { hole: 13, par: 3, strokeIndexMen: 12, strokeIndexLadies: 18, yardageMen: 200, yardageLadies: 141 },
  { hole: 14, par: 4, strokeIndexMen: 2, strokeIndexLadies: 12, yardageMen: 458, yardageLadies: 314 },
  { hole: 15, par: 3, strokeIndexMen: 18, strokeIndexLadies: 16, yardageMen: 155, yardageLadies: 112 },
  { hole: 16, par: 4, strokeIndexMen: 8, strokeIndexLadies: 8, yardageMen: 396, yardageLadies: 343 },
  { hole: 17, par: 4, strokeIndexMen: 4, strokeIndexLadies: 6, yardageMen: 449, yardageLadies: 357 },
  { hole: 18, par: 5, strokeIndexMen: 10, strokeIndexLadies: 4, yardageMen: 488, yardageLadies: 421 },
];

const calculateStablefordPoints = (score: number, par: number, strokesReceived: number): number => {
  // Handle pickup (score = 0) - always 0 points
  if (score === 0) return 0;
  
  const netScore = score - strokesReceived;
  const scoreToPar = netScore - par;
  
  switch (scoreToPar) {
    case -4: return 6;
    case -3: return 5;
    case -2: return 4;
    case -1: return 3;
    case 0: return 2;
    case 1: return 1;
    default: return scoreToPar > 1 ? 0 : 2;
  }
};

export const ScoringEntry: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [scores, setScores] = useState<{ [playerId: string]: number[] }>({});
  const [currentHole, setCurrentHole] = useState<number>(1);
  
  useEffect(() => {
    const savedPlayers = localStorage.getItem('icgs-players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  useEffect(() => {
    const savedScores = localStorage.getItem('icgs-scores');
    console.log('Loading saved scores from localStorage:', savedScores);
    if (savedScores) {
      const parsedScores = JSON.parse(savedScores);
      console.log('Parsed scores:', parsedScores);
      setScores(parsedScores);
    }
  }, []);

  useEffect(() => {
    // Only save if we have actual scores to save
    if (Object.keys(scores).length > 0) {
      console.log('Saving scores to localStorage:', scores);
      localStorage.setItem('icgs-scores', JSON.stringify(scores));
    }
  }, [scores]);

  const playerScores = useMemo(() => {
    return selectedPlayers.map(playerId => {
      const player = players.find(p => p.id === playerId)!;
      const playerScores = scores[playerId] || Array(18).fill(0);
      const playingHandicap = player.handicap;
      
      let totalScore = 0;
      let totalPoints = 0;
      let front9Score = 0;
      let front9Points = 0;
      let back9Score = 0;
      let back9Points = 0;
      let back6Points = 0;
      let back3Points = 0;
      let back2Points = 0;
      let back1Points = 0;
      
      for (let i = 0; i < 18; i++) {
        const holeScore = playerScores[i];
        if (holeScore > 0 || holeScore === 0) { // Include both actual scores and pickups
          const hole = COURSE_DATA[i];
          const strokeIndex = player.gender === 'female' ? hole.strokeIndexLadies : hole.strokeIndexMen;
          const strokesReceived = playingHandicap >= strokeIndex ? 1 : 0;
          const additionalStrokes = playingHandicap > 18 ? Math.floor((playingHandicap - strokeIndex) / 18) : 0;
          const totalStrokesReceived = strokesReceived + additionalStrokes;
          
          let holeActualScore = 0;
          // For pickup (score = 0), count as double par for total strokes
          if (holeScore === 0) {
            holeActualScore = hole.par * 2;
          } else if (holeScore > 0) {
            holeActualScore = holeScore;
          }
          
          // Calculate points (pickup always gives 0 points)
          const holePoints = (holeScore !== null && holeScore !== undefined) ? 
            calculateStablefordPoints(holeScore, hole.par, totalStrokesReceived) : 0;
          
          totalScore += holeActualScore;
          totalPoints += holePoints;
          
          // Front 9 (holes 0-8, i.e., holes 1-9)
          if (i < 9) {
            front9Score += holeActualScore;
            front9Points += holePoints;
          }
          // Back 9 (holes 9-17, i.e., holes 10-18)
          else {
            back9Score += holeActualScore;
            back9Points += holePoints;
            
            // Back 6 (holes 13-18, i.e., indices 12-17)
            if (i >= 12) {
              back6Points += holePoints;
              
              // Back 3 (holes 16-18, i.e., indices 15-17)
              if (i >= 15) {
                back3Points += holePoints;
                
                // Back 2 (holes 17-18, i.e., indices 16-17)
                if (i >= 16) {
                  back2Points += holePoints;
                  
                  // Back 1 (hole 18, i.e., index 17)
                  if (i === 17) {
                    back1Points += holePoints;
                  }
                }
              }
            }
          }
        }
      }
      
      return {
        playerId,
        scores: playerScores,
        totalScore,
        totalPoints,
        playingHandicap,
        front9Score,
        front9Points,
        back9Score,
        back9Points,
        back6Points,
        back3Points,
        back2Points,
        back1Points,
      };
    }).sort((a, b) => {
      // Primary sort: Total points (descending)
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      
      // Tiebreaker 1: Back 9 points (descending)
      if (b.back9Points !== a.back9Points) {
        return b.back9Points - a.back9Points;
      }
      
      // Tiebreaker 2: Back 6 points (descending)
      if (b.back6Points !== a.back6Points) {
        return b.back6Points - a.back6Points;
      }
      
      // Tiebreaker 3: Back 3 points (descending)
      if (b.back3Points !== a.back3Points) {
        return b.back3Points - a.back3Points;
      }
      
      // Tiebreaker 4: Back 2 points (descending)
      if (b.back2Points !== a.back2Points) {
        return b.back2Points - a.back2Points;
      }
      
      // Tiebreaker 5: Back 1 point (hole 18) (descending)
      if (b.back1Points !== a.back1Points) {
        return b.back1Points - a.back1Points;
      }
      
      // Final tiebreaker: Total strokes (ascending - lower is better)
      return a.totalScore - b.totalScore;
    });
  }, [selectedPlayers, scores, players]);

  const updateScore = (playerId: string, holeIndex: number, score: number) => {
    console.log('Updating score:', { playerId, holeIndex, score });
    setScores(prev => {
      const currentPlayerScores = prev[playerId] || Array(18).fill(0);
      const updatedPlayerScores = [...currentPlayerScores];
      updatedPlayerScores[holeIndex] = score;
      
      const newScores = {
        ...prev,
        [playerId]: updatedPlayerScores
      };
      
      console.log('New scores state:', newScores);
      return newScores;
    });
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => {
      const newSelection = prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId];
      
      if (!prev.includes(playerId) && !scores[playerId]) {
        // Only initialize with zeros if player has no saved scores
        console.log('Initializing new player scores for:', playerId);
        setScores(prevScores => ({
          ...prevScores,
          [playerId]: Array(18).fill(0)
        }));
      }
      
      return newSelection;
    });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Card title={`Live Scoring Entry - Hole ${currentHole}`}>
        <div style={{ marginBottom: theme.spacing.lg }}>
          <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.md, flexWrap: 'wrap' }}>
            {Array.from({ length: 18 }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => setCurrentHole(i + 1)}
                variant={currentHole === i + 1 ? "primary" : "secondary"}
                size="small"
                style={{ minWidth: '40px' }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: theme.spacing.md, 
            marginBottom: theme.spacing.lg,
            flexWrap: 'wrap',
          }}>
            <Button 
              onClick={() => setSelectedPlayers(players.map(p => p.id))}
              variant="success"
            >
              Select All Players
            </Button>
            <Button 
              onClick={() => setSelectedPlayers([])}
              variant="secondary"
            >
              Clear Selection
            </Button>
            <Button 
              onClick={() => {
                const csv = ['Player,Handicap,Gender,Category,' + COURSE_DATA.map(h => `H${h.hole}`).join(',') + ',Total Score,Total Points']
                  .concat(playerScores.map(ps => {
                    const player = players.find(p => p.id === ps.playerId)!;
                    return `${player.name},${player.handicap},${player.gender},${calculateCategory(player.handicap)},${ps.scores.join(',')},${ps.totalScore},${ps.totalPoints}`;
                  }))
                  .join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'icgs-scores.csv';
                a.click();
              }}
              variant="secondary"
            >
              💾 Export Scores
            </Button>
          </div>
        </div>

        {players.length === 0 ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xxl, color: theme.colors.darkGray }}>
            <h3>No Players Available</h3>
            <p>Please add players in the Player Management section first</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: theme.spacing.lg }}>
              <h3 style={{ marginBottom: theme.spacing.md, color: theme.colors.primary }}>
                Select Players for Competition ({selectedPlayers.length} selected)
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.lg,
              }}>
                {players.map(player => (
                  <label 
                    key={player.id}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: theme.spacing.sm,
                      backgroundColor: selectedPlayers.includes(player.id) ? theme.colors.primaryLight : theme.colors.lightGray,
                      color: selectedPlayers.includes(player.id) ? theme.colors.white : theme.colors.darkGray,
                      borderRadius: theme.components.card.borderRadius,
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(player.id)}
                      onChange={() => togglePlayerSelection(player.id)}
                      style={{ marginRight: theme.spacing.sm }}
                    />
                    {player.name} (H{player.handicap})
                  </label>
                ))}
              </div>
            </div>

            {selectedPlayers.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  backgroundColor: theme.colors.white,
                  minWidth: '1600px',
                }}>
                  <thead>
                    <tr style={{ backgroundColor: theme.colors.primary, color: theme.colors.white }}>
                      <th style={{ padding: theme.spacing.sm, textAlign: 'left', minWidth: '150px', position: 'sticky', left: 0, backgroundColor: theme.colors.primary }}>Player</th>
                      <th style={{ padding: theme.spacing.sm, textAlign: 'center', minWidth: '50px' }}>HC</th>
                      {COURSE_DATA.map(hole => (
                        <th key={hole.hole} style={{ 
                          padding: theme.spacing.sm, 
                          textAlign: 'center', 
                          minWidth: '60px',
                          backgroundColor: currentHole === hole.hole ? theme.colors.success : theme.colors.primary,
                          position: 'relative',
                          border: currentHole === hole.hole ? `3px solid ${theme.colors.white}` : 'none',
                          boxShadow: currentHole === hole.hole ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                        }}>
                          <div style={{ 
                            fontSize: theme.typography.organizer.small, 
                            fontWeight: 'bold',
                            textShadow: currentHole === hole.hole ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
                          }}>
                            {currentHole === hole.hole ? '➤ ' : ''}{hole.hole}{currentHole === hole.hole ? ' ⬅' : ''}
                          </div>
                          <div style={{ fontSize: '10px', opacity: 0.8 }}>
                            Par {hole.par}
                          </div>
                        </th>
                      ))}
                      <th style={{ padding: theme.spacing.sm, textAlign: 'center', minWidth: '70px' }}>F9 Pts</th>
                      <th style={{ padding: theme.spacing.sm, textAlign: 'center', minWidth: '70px' }}>B9 Pts</th>
                      <th style={{ padding: theme.spacing.sm, textAlign: 'center', minWidth: '80px' }}>Total Strokes</th>
                      <th style={{ padding: theme.spacing.sm, textAlign: 'center', minWidth: '80px' }}>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerScores.map((playerScore, playerIndex) => {
                      const player = players.find(p => p.id === playerScore.playerId)!;
                      
                      return (
                        <React.Fragment key={playerScore.playerId}>
                          {/* Score Row */}
                          <tr style={{
                            backgroundColor: playerIndex % 2 === 0 ? theme.colors.white : theme.colors.lightGray,
                            borderBottom: `1px solid ${theme.colors.darkGray}`,
                            borderTop: `3px solid ${theme.colors.primary}`,
                          }}>
                            <td style={{
                              padding: theme.spacing.sm,
                              fontWeight: 'bold',
                              position: 'sticky',
                              left: 0,
                              backgroundColor: playerIndex % 2 === 0 ? theme.colors.white : theme.colors.lightGray,
                              borderRight: `3px solid ${theme.colors.primary}`,
                              borderLeft: `4px solid ${theme.colors.primary}`,
                            }}>
                              {player.name}
                              <div style={{ fontSize: theme.typography.organizer.small, color: theme.colors.darkGray }}>
                                {player.gender === 'male' ? '♂️' : '♀️'} Cat {calculateCategory(player.handicap)}
                              </div>
                            </td>
                            <td style={{ padding: theme.spacing.sm, textAlign: 'center', fontWeight: 'bold' }}>
                              {player.handicap}
                            </td>
                            {COURSE_DATA.map((hole, holeIndex) => {
                              const strokeIndex = player.gender === 'female' ? hole.strokeIndexLadies : hole.strokeIndexMen;
                              const strokesReceived = playerScore.playingHandicap >= strokeIndex ? 1 : 0;
                              const additionalStrokes = playerScore.playingHandicap > 18 ? Math.floor((playerScore.playingHandicap - strokeIndex) / 18) : 0;
                              const totalStrokesReceived = strokesReceived + additionalStrokes;
                              const actualScore = playerScore.scores[holeIndex];
                              const holeScore = actualScore !== undefined && actualScore !== null ? actualScore : hole.par;
                              const holePoints = (actualScore !== undefined && actualScore !== null) ? calculateStablefordPoints(actualScore, hole.par, totalStrokesReceived) : 0;
                              
                              return (
                                <td key={hole.hole} style={{ 
                                  padding: '4px', 
                                  textAlign: 'center',
                                  backgroundColor: currentHole === hole.hole ? theme.colors.info : 'transparent',
                                }}>
                                  <input
                                    type="number"
                                    min="0"
                                    max="15"
                                    value={actualScore !== undefined && actualScore !== null ? actualScore : holeScore}
                                    data-hole={hole.hole}
                                    data-player={playerScore.playerId}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '') {
                                        // Don't update if empty - let it show par default
                                        return;
                                      }
                                      const numValue = parseInt(value);
                                      if (!isNaN(numValue)) {
                                        updateScore(playerScore.playerId, holeIndex, numValue);
                                      }
                                    }}
                                    onFocus={(e) => {
                                      setCurrentHole(holeIndex + 1);
                                      e.target.select(); // Select all text for easy overwriting
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === 'ArrowRight') {
                                        e.preventDefault();
                                        if (holeIndex < 17) {
                                          setCurrentHole(holeIndex + 2);
                                          // Focus next hole input after state update
                                          setTimeout(() => {
                                            const nextHoleInputs = document.querySelectorAll(`input[data-hole="${holeIndex + 2}"][data-player="${playerScore.playerId}"]`);
                                            if (nextHoleInputs.length > 0) {
                                              (nextHoleInputs[0] as HTMLInputElement).focus();
                                              (nextHoleInputs[0] as HTMLInputElement).select();
                                            }
                                          }, 50);
                                        }
                                      } else if (e.key === 'ArrowLeft') {
                                        e.preventDefault();
                                        if (holeIndex > 0) {
                                          setCurrentHole(holeIndex);
                                          // Focus previous hole input after state update
                                          setTimeout(() => {
                                            const prevHoleInputs = document.querySelectorAll(`input[data-hole="${holeIndex}"][data-player="${playerScore.playerId}"]`);
                                            if (prevHoleInputs.length > 0) {
                                              (prevHoleInputs[0] as HTMLInputElement).focus();
                                              (prevHoleInputs[0] as HTMLInputElement).select();
                                            }
                                          }, 50);
                                        }
                                      }
                                    }}
                                    onBlur={(e) => {
                                      // Auto-save when moving away from input
                                      const value = e.target.value;
                                      if (value !== '') {
                                        const numValue = parseInt(value);
                                        if (!isNaN(numValue) && numValue !== actualScore) {
                                          updateScore(playerScore.playerId, holeIndex, numValue);
                                        }
                                      }
                                    }}
                                    style={{
                                      width: '45px',
                                      padding: '4px 2px',
                                      textAlign: 'center',
                                      border: `2px solid ${currentHole === hole.hole ? theme.colors.success : theme.colors.darkGray}`,
                                      borderRadius: '3px',
                                      fontSize: theme.typography.organizer.small,
                                      backgroundColor: currentHole === hole.hole ? '#f0fff0' : 
                                                      actualScore === 0 ? '#ffebee' : 
                                                      actualScore !== undefined && actualScore !== null && actualScore < hole.par ? '#e8f5e8' :
                                                      actualScore !== undefined && actualScore !== null && actualScore > hole.par ? '#fff3e0' :
                                                      theme.colors.white,
                                      color: actualScore === 0 ? '#d32f2f' : 
                                             actualScore !== undefined && actualScore !== null && actualScore < hole.par ? '#2e7d32' :
                                             actualScore !== undefined && actualScore !== null && actualScore > hole.par ? '#ff9800' :
                                             (actualScore > 0) ? theme.colors.darkGray : '#999999',
                                      fontStyle: (actualScore !== undefined && actualScore !== null) ? 'normal' : 'italic',
                                      fontWeight: actualScore === 0 ? 'bold' : 'bold',
                                    }}
                                  />
                                  {totalStrokesReceived > 0 && (
                                    <div style={{ fontSize: '8px', color: theme.colors.info, marginTop: '2px' }}>
                                      +{totalStrokesReceived}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td style={{ 
                              padding: theme.spacing.sm, 
                              textAlign: 'center',
                              fontWeight: 'bold',
                              color: theme.colors.info,
                            }}>
                              {playerScore.front9Points}
                            </td>
                            <td style={{ 
                              padding: theme.spacing.sm, 
                              textAlign: 'center',
                              fontWeight: 'bold',
                              color: theme.colors.info,
                            }}>
                              {playerScore.back9Points}
                            </td>
                            <td style={{ 
                              padding: theme.spacing.sm, 
                              textAlign: 'center', 
                              fontWeight: 'bold',
                              fontSize: theme.typography.organizer.h3,
                            }}>
                              {playerScore.totalScore}
                            </td>
                            <td style={{ 
                              padding: theme.spacing.sm, 
                              textAlign: 'center',
                              fontWeight: 'bold',
                              color: theme.colors.primary,
                              fontSize: theme.typography.organizer.h3,
                            }}>
                              {playerScore.totalPoints}
                            </td>
                          </tr>
                          
                          {/* Points Row */}
                          <tr style={{
                            backgroundColor: playerIndex % 2 === 0 ? '#f0f8ff' : '#e6f3ff',
                            borderBottom: `4px solid ${theme.colors.primary}`,
                          }}>
                            <td style={{
                              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                              fontSize: theme.typography.organizer.small,
                              color: theme.colors.darkGray,
                              position: 'sticky',
                              left: 0,
                              backgroundColor: playerIndex % 2 === 0 ? '#f0f8ff' : '#e6f3ff',
                              borderRight: `3px solid ${theme.colors.primary}`,
                              borderLeft: `4px solid ${theme.colors.primary}`,
                            }}>
                              Points
                            </td>
                            <td></td>
                            {COURSE_DATA.map((hole, holeIndex) => {
                              // Use the same player from the current playerScore
                              const currentPlayer = players.find(p => p.id === playerScore.playerId)!;
                              const strokeIndex = currentPlayer.gender === 'female' ? hole.strokeIndexLadies : hole.strokeIndexMen;
                              const strokesReceived = playerScore.playingHandicap >= strokeIndex ? 1 : 0;
                              const additionalStrokes = playerScore.playingHandicap > 18 ? Math.floor((playerScore.playingHandicap - strokeIndex) / 18) : 0;
                              const totalStrokesReceived = strokesReceived + additionalStrokes;
                              const actualScore = playerScore.scores[holeIndex];
                              const holePoints = (actualScore !== undefined && actualScore !== null) ? calculateStablefordPoints(actualScore, hole.par, totalStrokesReceived) : 0;

                              return (
                                <td key={hole.hole} style={{
                                  padding: '4px',
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  color: holePoints >= 4 ? theme.colors.success :
                                         holePoints >= 2 ? theme.colors.info :
                                         holePoints === 1 ? theme.colors.warning : theme.colors.darkGray,
                                  backgroundColor: currentHole === hole.hole ? theme.colors.info : 'transparent',
                                }}>
                                  {(actualScore !== undefined && actualScore !== null) ? holePoints : '-'}
                                </td>
                              );
                            })}
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};