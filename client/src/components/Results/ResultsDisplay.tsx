import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';

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
}

interface PlayerResult {
  player: Player;
  totalScore: number;
  totalPoints: number;
  playingHandicap: number;
  position: number;
  scores: number[];
  points: number[];
  front9Points: number;
  back9Points: number;
  back6Points: number;
  back3Points: number;
  back2Points: number;
  back1Points: number;
}

const COURSE_DATA: CourseHole[] = [
  { hole: 1, par: 4, strokeIndexMen: 7, strokeIndexLadies: 7 },
  { hole: 2, par: 5, strokeIndexMen: 11, strokeIndexLadies: 3 },
  { hole: 3, par: 4, strokeIndexMen: 3, strokeIndexLadies: 13 },
  { hole: 4, par: 3, strokeIndexMen: 15, strokeIndexLadies: 17 },
  { hole: 5, par: 4, strokeIndexMen: 1, strokeIndexLadies: 1 },
  { hole: 6, par: 3, strokeIndexMen: 9, strokeIndexLadies: 15 },
  { hole: 7, par: 4, strokeIndexMen: 5, strokeIndexLadies: 11 },
  { hole: 8, par: 5, strokeIndexMen: 17, strokeIndexLadies: 5 },
  { hole: 9, par: 4, strokeIndexMen: 13, strokeIndexLadies: 9 },
  { hole: 10, par: 4, strokeIndexMen: 6, strokeIndexLadies: 2 },
  { hole: 11, par: 4, strokeIndexMen: 16, strokeIndexLadies: 14 },
  { hole: 12, par: 5, strokeIndexMen: 14, strokeIndexLadies: 10 },
  { hole: 13, par: 3, strokeIndexMen: 12, strokeIndexLadies: 18 },
  { hole: 14, par: 4, strokeIndexMen: 2, strokeIndexLadies: 12 },
  { hole: 15, par: 3, strokeIndexMen: 18, strokeIndexLadies: 16 },
  { hole: 16, par: 4, strokeIndexMen: 8, strokeIndexLadies: 8 },
  { hole: 17, par: 4, strokeIndexMen: 4, strokeIndexLadies: 6 },
  { hole: 18, par: 5, strokeIndexMen: 10, strokeIndexLadies: 4 },
];

const calculateStablefordPoints = (score: number, par: number, strokesReceived: number): number => {
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

export const ResultsDisplay: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<{ [playerId: string]: number[] }>({});
  const [currentTime, setCurrentTime] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<'overall' | 'category'>('overall');
  const [previousPositions, setPreviousPositions] = useState<{ [playerId: string]: number }>({});
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  useEffect(() => {
    const loadData = () => {
      const savedPlayers = localStorage.getItem('icgs-players');
      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers));
      }

      const savedScores = localStorage.getItem('icgs-scores');
      if (savedScores) {
        setScores(JSON.parse(savedScores));
        setLastUpdateTime(Date.now());
      }
    };

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    // Initial load
    loadData();
    updateTime();

    // Set up intervals
    const timeInterval = setInterval(updateTime, 1000);
    const dataInterval = setInterval(loadData, 5000); // Refresh data every 5 seconds

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const processResults = (): PlayerResult[] => {
    return players
      .filter(player => scores[player.id] && scores[player.id].some(score => score > 0))
      .map(player => {
        const playerScores = scores[player.id] || Array(18).fill(0);
        const playingHandicap = player.handicap;
        
        let totalScore = 0;
        let totalPoints = 0;
        let front9Points = 0;
        let back9Points = 0;
        let back6Points = 0;
        let back3Points = 0;
        let back2Points = 0;
        let back1Points = 0;
        const points: number[] = [];
        
        for (let i = 0; i < 18; i++) {
          const holeScore = playerScores[i];
          if (holeScore > 0 || holeScore === 0) {
            const hole = COURSE_DATA[i];
            const strokeIndex = player.gender === 'female' ? hole.strokeIndexLadies : hole.strokeIndexMen;
            const strokesReceived = playingHandicap >= strokeIndex ? 1 : 0;
            const additionalStrokes = playingHandicap > 18 ? Math.floor((playingHandicap - strokeIndex) / 18) : 0;
            const totalStrokesReceived = strokesReceived + additionalStrokes;
            
            // Calculate actual score for total (pickup = double par)
            let holeActualScore = 0;
            if (holeScore === 0) {
              holeActualScore = hole.par * 2;
            } else if (holeScore > 0) {
              holeActualScore = holeScore;
            }
            
            const holePoints = calculateStablefordPoints(holeScore, hole.par, totalStrokesReceived);
            
            totalScore += holeActualScore;
            totalPoints += holePoints;
            points.push(holePoints);
            
            // Front 9 (holes 0-8, i.e., holes 1-9)
            if (i < 9) {
              front9Points += holePoints;
            }
            // Back 9 (holes 9-17, i.e., holes 10-18)
            else {
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
          } else {
            points.push(0);
          }
        }
        
        return {
          player,
          totalScore,
          totalPoints,
          playingHandicap,
          position: 0,
          scores: playerScores,
          points,
          front9Points,
          back9Points,
          back6Points,
          back3Points,
          back2Points,
          back1Points,
        };
      })
      .sort((a, b) => {
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
      })
      .map((result, index) => ({ ...result, position: index + 1 }));
  };

  const results = processResults();
  
  // Update position tracking
  useEffect(() => {
    const currentPositions: { [playerId: string]: number } = {};
    results.forEach(result => {
      currentPositions[result.player.id] = result.position;
    });
    
    // Store previous positions before updating
    setPreviousPositions(prev => {
      // If this is the first load or enough time has passed, update positions
      const now = Date.now();
      if (Object.keys(prev).length === 0 || now - lastUpdateTime > 4000) {
        return currentPositions;
      }
      return prev;
    });
  }, [results, lastUpdateTime]);

  const getPositionChange = (playerId: string, currentPosition: number) => {
    const previousPosition = previousPositions[playerId];
    
    // Debug logging
    console.log(`Player ${playerId}: Previous=${previousPosition}, Current=${currentPosition}`);
    
    if (!previousPosition || previousPosition === currentPosition) {
      return null; // No change
    }
    
    if (previousPosition > currentPosition) {
      return 'up'; // Moved up in ranking (lower position number)
    } else {
      return 'down'; // Moved down in ranking (higher position number)
    }
  };

  const resultsByCategory = {
    A: results.filter(r => r.player.category === 'A'),
    B: results.filter(r => r.player.category === 'B'),
    C: results.filter(r => r.player.category === 'C'),
  };

  const getTrophyEmoji = (position: number) => {
    switch (position) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return theme.colors.white;
    }
  };

  if (results.length === 0) {
    return (
      <div style={{
        height: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.colors.white,
        textAlign: 'center',
        padding: theme.spacing.xl,
      }}>
        <h1 style={{ fontSize: theme.typography.display4K.hero, marginBottom: theme.spacing.xl }}>
          ICGS COMPETITION
        </h1>
        <h2 style={{ fontSize: theme.typography.display4K.large, marginBottom: theme.spacing.lg }}>
          Luttrellstown Castle Golf Club
        </h2>
        <p style={{ fontSize: theme.typography.display4K.medium, marginBottom: theme.spacing.xxl }}>
          Competition in Progress...
        </p>
        <p style={{ fontSize: theme.typography.display4K.small }}>
          Waiting for scores to be entered
        </p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
      color: theme.colors.white,
      padding: theme.spacing.xl,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
      }}>
        <div>
          <h1 style={{ 
            fontSize: theme.typography.display4K.hero, 
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}>
            ICGS LEADERBOARD
          </h1>
          <h2 style={{ 
            fontSize: theme.typography.display4K.medium, 
            margin: `${theme.spacing.sm} 0 0 0`,
            opacity: 0.9,
          }}>
            Luttrellstown Castle Golf Club
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: theme.typography.display4K.large,
            fontWeight: 'bold',
            marginBottom: theme.spacing.sm,
          }}>
            {currentTime}
          </div>
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
          }}>
            <button
              onClick={() => setDisplayMode('overall')}
              style={{
                backgroundColor: displayMode === 'overall' ? theme.colors.success : 'transparent',
                color: theme.colors.white,
                border: `2px solid ${theme.colors.white}`,
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                fontSize: theme.typography.display4K.small,
                borderRadius: theme.components.button.borderRadius,
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              OVERALL
            </button>
            <button
              onClick={() => setDisplayMode('category')}
              style={{
                backgroundColor: displayMode === 'category' ? theme.colors.success : 'transparent',
                color: theme.colors.white,
                border: `2px solid ${theme.colors.white}`,
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                fontSize: theme.typography.display4K.small,
                borderRadius: theme.components.button.borderRadius,
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              CATEGORY
            </button>
          </div>
        </div>
      </div>

      {displayMode === 'overall' ? (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: theme.spacing.xl,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{ 
            fontSize: theme.typography.display4K.large,
            color: theme.colors.primary,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
          }}>
            OVERALL LEADERBOARD
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.lg }}>
            {results.slice(0, 10).map((result) => (
              <div
                key={result.player.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 200px 200px 150px',
                  alignItems: 'center',
                  backgroundColor: getPositionColor(result.position),
                  color: result.position <= 3 ? '#000' : theme.colors.primary,
                  padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
                  borderRadius: '12px',
                  boxShadow: result.position <= 3 ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                  border: result.position === 1 ? '3px solid #FFD700' : 'none',
                }}
              >
                <div style={{
                  fontSize: theme.typography.display4K.large,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.sm,
                }}>
                  {getTrophyEmoji(result.position)}
                  <span>{result.position}</span>
                  {(() => {
                    const change = getPositionChange(result.player.id, result.position);
                    // For testing - show arrows for first few players
                    if (result.position <= 3) {
                      const testChange = result.position === 1 ? 'up' : result.position === 2 ? 'down' : null;
                      if (testChange === 'up') {
                        return <span style={{ color: theme.colors.success, fontSize: '24px', marginLeft: '8px' }}>↗</span>;
                      } else if (testChange === 'down') {
                        return <span style={{ color: theme.colors.warning, fontSize: '24px', marginLeft: '8px' }}>↘</span>;
                      }
                    }
                    
                    if (change === 'up') {
                      return <span style={{ color: theme.colors.success, fontSize: '24px', marginLeft: '8px' }}>↗</span>;
                    } else if (change === 'down') {
                      return <span style={{ color: theme.colors.warning, fontSize: '24px', marginLeft: '8px' }}>↘</span>;
                    }
                    return null;
                  })()}
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: theme.typography.display4K.medium,
                    fontWeight: 'bold',
                    marginBottom: theme.spacing.xs,
                  }}>
                    {result.player.name}
                  </div>
                  <div style={{ 
                    fontSize: theme.typography.display4K.small,
                    opacity: 0.8,
                  }}>
                    {result.player.gender === 'male' ? '♂️' : '♀️'} HC {result.player.handicap} | Cat {result.player.category}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: theme.typography.display4K.large,
                    fontWeight: 'bold',
                    color: result.totalPoints >= 36 ? theme.colors.success : 
                           result.totalPoints >= 30 ? theme.colors.info : theme.colors.warning,
                  }}>
                    {result.totalPoints}
                  </div>
                  <div style={{ 
                    fontSize: theme.typography.display4K.small,
                    opacity: 0.8,
                  }}>
                    points
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: theme.typography.display4K.medium,
                    fontWeight: '600',
                  }}>
                    {result.totalScore}
                  </div>
                  <div style={{ 
                    fontSize: theme.typography.display4K.small,
                    opacity: 0.8,
                  }}>
                    strokes
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: theme.typography.display4K.small,
                    fontWeight: '600',
                  }}>
                    HC {result.playingHandicap}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.xl }}>
          {(['A', 'B', 'C'] as const).map(category => (
            <div key={category} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: theme.spacing.xl,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <h3 style={{ 
                fontSize: theme.typography.display4K.large,
                color: theme.colors.primary,
                textAlign: 'center',
                marginBottom: theme.spacing.lg,
              }}>
                CATEGORY {category}
              </h3>
              
              <div style={{ display: 'grid', gap: theme.spacing.md }}>
                {resultsByCategory[category].slice(0, 5).map((result, index) => (
                  <div
                    key={result.player.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: index === 0 ? '#FFD700' : theme.colors.lightGray,
                      color: index === 0 ? '#000' : theme.colors.primary,
                      padding: theme.spacing.md,
                      borderRadius: '8px',
                      boxShadow: index === 0 ? '0 4px 16px rgba(255,215,0,0.3)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                      <span style={{ 
                        fontSize: theme.typography.display4K.medium,
                        fontWeight: 'bold',
                        minWidth: '60px',
                      }}>
                        {index === 0 ? '🏆' : `${index + 1}.`}
                      </span>
                      <div>
                        <div style={{ 
                          fontSize: theme.typography.display4K.small,
                          fontWeight: 'bold',
                        }}>
                          {result.player.name}
                        </div>
                        <div style={{ 
                          fontSize: theme.typography.organizer.small,
                          opacity: 0.8,
                        }}>
                          {result.player.gender === 'male' ? '♂️' : '♀️'} HC {result.player.handicap}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: theme.typography.display4K.medium,
                        fontWeight: 'bold',
                      }}>
                        {result.totalPoints}
                      </div>
                      <div style={{ 
                        fontSize: theme.typography.organizer.small,
                        opacity: 0.8,
                      }}>
                        pts
                      </div>
                    </div>
                  </div>
                ))}
                
                {resultsByCategory[category].length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: theme.spacing.xl,
                    fontSize: theme.typography.display4K.small,
                    color: theme.colors.darkGray,
                    opacity: 0.7,
                  }}>
                    No players in this category
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        position: 'fixed',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: theme.spacing.md,
        borderRadius: '8px',
        fontSize: theme.typography.display4K.small,
      }}>
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};