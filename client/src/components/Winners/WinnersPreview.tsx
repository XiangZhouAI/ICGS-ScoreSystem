import React, { useState, useEffect } from 'react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { theme } from '../../theme';

interface Player {
  name: string;
  handicap: number;
  category: 'A' | 'B' | 'C';
  gender: 'male' | 'female';
  scores: number[];
  stablefordPoints: number[];
  totalPoints: number;
  front9Points: number;
  back9Points: number;
}

interface WinnerOverride {
  prizeId: string;
  winnerName: string;
}

interface PrizeWinner {
  name: string;
  description?: string;
  isMultiple?: boolean;
}

const WinnersPreview: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [iDontCareThreshold, setIDontCareThreshold] = useState<number>(20);
  const [longestDriveMaleWinner, setLongestDriveMaleWinner] = useState('');
  const [longestDriveFemaleWinner, setLongestDriveFemaleWinner] = useState('');
  const [closestToPinHole1Winner, setClosestToPinHole1Winner] = useState('');
  const [closestToPinHole2Winner, setClosestToPinHole2Winner] = useState('');
  const [overrides, setOverrides] = useState<WinnerOverride[]>([]);

  // Load players data and saved winner settings
  useEffect(() => {
    const savedPlayers = localStorage.getItem('icgs-players');
    const savedScores = localStorage.getItem('icgs-scores');

    if (savedPlayers && savedScores) {
      try {
        const playersData = JSON.parse(savedPlayers);
        const scoresData = JSON.parse(savedScores);

        const combinedData = playersData.map((player: any) => {
          // Get raw scores using player.id (this is how scoring system saves it)
          const rawScores = scoresData[player.id] || Array(18).fill(0);

          // Calculate stableford points and totals (replicating scoring logic)
          const stablefordPoints = [];
          let totalPoints = 0;
          let front9Points = 0;
          let back9Points = 0;

          // Course data for calculations (Par 3 holes: 4, 6, 13, 15)
          const coursePars = [4, 5, 4, 3, 4, 3, 4, 5, 4, 4, 4, 5, 3, 4, 3, 4, 4, 5];
          const strokeIndexMen = [7, 11, 3, 15, 1, 9, 5, 17, 13, 6, 16, 14, 12, 2, 18, 8, 4, 10];
          const strokeIndexLadies = [7, 3, 13, 17, 1, 15, 11, 5, 9, 2, 14, 10, 18, 12, 16, 8, 6, 4];

          for (let i = 0; i < 18; i++) {
            const par = coursePars[i];
            const strokeIndex = player.gender === 'female' ? strokeIndexLadies[i] : strokeIndexMen[i];
            const strokesReceived = player.handicap >= strokeIndex ? 1 : 0;
            const additionalStrokes = player.handicap > 18 ? Math.floor((player.handicap - strokeIndex) / 18) : 0;
            const totalStrokesReceived = strokesReceived + additionalStrokes;

            const actualScore = rawScores[i] || par;
            const netScore = actualScore - totalStrokesReceived;
            const scoreDiff = par - netScore;

            // Stableford points: -4→6pts, -3→5pts, -2→4pts, -1→3pts, Par→2pts, +1→1pt, +2+→0pts
            let holePoints = 0;
            if (scoreDiff >= 4) holePoints = 6;      // 4+ under par (albatross+)
            else if (scoreDiff === 3) holePoints = 5; // 3 under par (albatross)
            else if (scoreDiff === 2) holePoints = 4; // 2 under par (eagle)
            else if (scoreDiff === 1) holePoints = 3; // 1 under par (birdie)
            else if (scoreDiff === 0) holePoints = 2; // par
            else if (scoreDiff === -1) holePoints = 1; // 1 over par (bogey)
            else holePoints = 0; // 2+ over par (double bogey+)

            stablefordPoints.push(holePoints);
            totalPoints += holePoints;

            if (i < 9) front9Points += holePoints;
            else back9Points += holePoints;
          }

          return {
            ...player,
            scores: rawScores,
            stablefordPoints,
            totalPoints,
            front9Points,
            back9Points
          };
        });

        setPlayers(combinedData);
      } catch (error) {
        console.error('Error loading player data:', error);
      }
    }

    // Check if final winners list exists first
    const savedFinalWinners = localStorage.getItem('icgs-final-winners');

    if (savedFinalWinners) {
      // If final winners exist, load from final winners list
      try {
        const finalWinners = JSON.parse(savedFinalWinners);
        const loadedOverrides: WinnerOverride[] = [];

        finalWinners.forEach((winner: any) => {
          if (winner.winnerName) {
            loadedOverrides.push({
              prizeId: winner.id,
              winnerName: winner.winnerName
            });
          }
        });

        setOverrides(loadedOverrides);

        // Also load manual entry fields if they exist in winner settings
        const savedWinnerSettings = localStorage.getItem('icgs-winner-settings');
        if (savedWinnerSettings) {
          try {
            const settings = JSON.parse(savedWinnerSettings);
            setIDontCareThreshold(settings.iDontCareThreshold || 20);
            setLongestDriveMaleWinner(settings.longestDriveMaleWinner || '');
            setLongestDriveFemaleWinner(settings.longestDriveFemaleWinner || '');
            setClosestToPinHole1Winner(settings.closestToPinHole1Winner || '');
            setClosestToPinHole2Winner(settings.closestToPinHole2Winner || '');
          } catch (error) {
            console.error('Error loading winner settings:', error);
          }
        }
      } catch (error) {
        console.error('Error loading final winners:', error);
      }
    } else {
      // If no final winners exist, load from winner settings (old behavior)
      const savedWinnerSettings = localStorage.getItem('icgs-winner-settings');
      if (savedWinnerSettings) {
        try {
          const settings = JSON.parse(savedWinnerSettings);
          setIDontCareThreshold(settings.iDontCareThreshold || 20);
          setLongestDriveMaleWinner(settings.longestDriveMaleWinner || '');
          setLongestDriveFemaleWinner(settings.longestDriveFemaleWinner || '');
          setClosestToPinHole1Winner(settings.closestToPinHole1Winner || '');
          setClosestToPinHole2Winner(settings.closestToPinHole2Winner || '');
          setOverrides(settings.overrides || []);
        } catch (error) {
          console.error('Error loading winner settings:', error);
        }
      }
    }
  }, []);

  // Save winner settings to localStorage
  const saveWinnerSettings = () => {
    const settings = {
      iDontCareThreshold,
      longestDriveMaleWinner,
      longestDriveFemaleWinner,
      closestToPinHole1Winner,
      closestToPinHole2Winner,
      overrides
    };
    localStorage.setItem('icgs-winner-settings', JSON.stringify(settings));
  };

  // Save settings whenever any value changes
  useEffect(() => {
    saveWinnerSettings();
  }, [
    iDontCareThreshold,
    longestDriveMaleWinner,
    longestDriveFemaleWinner,
    closestToPinHole1Winner,
    closestToPinHole2Winner,
    overrides
  ]);

  // Tie-breaking logic
  const tieBreaker = (playerA: Player, playerB: Player): number => {
    if (playerA.totalPoints !== playerB.totalPoints) {
      return playerB.totalPoints - playerA.totalPoints;
    }

    // Back 9
    if (playerA.back9Points !== playerB.back9Points) {
      return playerB.back9Points - playerA.back9Points;
    }

    // Back 6 (holes 13-18)
    const back6A = playerA.stablefordPoints.slice(12, 18).reduce((sum, p) => sum + p, 0);
    const back6B = playerB.stablefordPoints.slice(12, 18).reduce((sum, p) => sum + p, 0);
    if (back6A !== back6B) {
      return back6B - back6A;
    }

    // Back 3 (holes 16-18)
    const back3A = playerA.stablefordPoints.slice(15, 18).reduce((sum, p) => sum + p, 0);
    const back3B = playerB.stablefordPoints.slice(15, 18).reduce((sum, p) => sum + p, 0);
    if (back3A !== back3B) {
      return back3B - back3A;
    }

    // Back 2 (holes 17-18)
    const back2A = playerA.stablefordPoints.slice(16, 18).reduce((sum, p) => sum + p, 0);
    const back2B = playerB.stablefordPoints.slice(16, 18).reduce((sum, p) => sum + p, 0);
    if (back2A !== back2B) {
      return back2B - back2A;
    }

    // Back 1 (hole 18)
    return playerB.stablefordPoints[17] - playerA.stablefordPoints[17];
  };

  // Calculate winners for each prize
  const calculateWinners = () => {
    const sortedPlayers = [...players].sort(tieBreaker);
    const malePlayers = players.filter(p => p.gender === 'male').sort(tieBreaker);
    const femalePlayers = players.filter(p => p.gender === 'female').sort(tieBreaker);

    const categoryA = players.filter(p => p.category === 'A').sort(tieBreaker);
    const categoryB = players.filter(p => p.category === 'B').sort(tieBreaker);
    const categoryC = players.filter(p => p.category === 'C').sort(tieBreaker);

    const winners: { [key: string]: PrizeWinner } = {};
    const runnersUp: { [key: string]: PrizeWinner } = {};

    // 1. 第一名 (Overall Winner)
    if (sortedPlayers.length > 0) {
      winners['overall1st'] = { name: sortedPlayers[0].name };
      if (sortedPlayers.length > 1) runnersUp['overall1st'] = { name: sortedPlayers[1].name };
    }

    // 2. 第二名 (Overall Second)
    if (sortedPlayers.length > 1) {
      winners['overall2nd'] = { name: sortedPlayers[1].name };
      if (sortedPlayers.length > 2) runnersUp['overall2nd'] = { name: sortedPlayers[2].name };
    }

    // 3. 第三名 (Overall Third)
    if (sortedPlayers.length > 2) {
      winners['overall3rd'] = { name: sortedPlayers[2].name };
      if (sortedPlayers.length > 3) runnersUp['overall3rd'] = { name: sortedPlayers[3].name };
    }

    // 4. Division winners (A, B, C categories)
    if (categoryA.length > 0) {
      winners['divisionA'] = { name: categoryA[0].name };
      if (categoryA.length > 1) runnersUp['divisionA'] = { name: categoryA[1].name };
    }
    if (categoryB.length > 0) {
      winners['divisionB'] = { name: categoryB[0].name };
      if (categoryB.length > 1) runnersUp['divisionB'] = { name: categoryB[1].name };
    }
    if (categoryC.length > 0) {
      winners['divisionC'] = { name: categoryC[0].name };
      if (categoryC.length > 1) runnersUp['divisionC'] = { name: categoryC[1].name };
    }

    // 5. Women's champion
    if (femalePlayers.length > 0) {
      winners['womensChampion'] = { name: femalePlayers[0].name };
      if (femalePlayers.length > 1) runnersUp['womensChampion'] = { name: femalePlayers[1].name };
    }

    // 6. Front 9 winner
    const front9Sorted = [...players].sort((a, b) => b.front9Points - a.front9Points);
    if (front9Sorted.length > 0) {
      winners['front9'] = { name: front9Sorted[0].name };
      if (front9Sorted.length > 1) runnersUp['front9'] = { name: front9Sorted[1].name };
    }

    // 7. Back 9 winner
    const back9Sorted = [...players].sort((a, b) => b.back9Points - a.back9Points);
    if (back9Sorted.length > 0) {
      winners['back9'] = { name: back9Sorted[0].name };
      if (back9Sorted.length > 1) runnersUp['back9'] = { name: back9Sorted[1].name };
    }

    // 8. Front/Back 9 difference (biggest difference between front and back 9 points)
    const frontBackDiffSorted = [...players].sort((a, b) => {
      const diffA = Math.abs(a.front9Points - a.back9Points);
      const diffB = Math.abs(b.front9Points - b.back9Points);
      return diffB - diffA; // Largest difference first
    });
    if (frontBackDiffSorted.length > 0) {
      winners['frontBackDiff'] = { name: frontBackDiffSorted[0].name };
      if (frontBackDiffSorted.length > 1) runnersUp['frontBackDiff'] = { name: frontBackDiffSorted[1].name };
    }

    // 9. Longest drive (manual entry - male/female)
    if (longestDriveMaleWinner) {
      winners['longestDriveMale'] = { name: longestDriveMaleWinner };
    }
    if (longestDriveFemaleWinner) {
      winners['longestDriveFemale'] = { name: longestDriveFemaleWinner };
    }

    // 10. Closest to pin (manual entry)
    if (closestToPinHole1Winner) {
      winners['closestToPinHole1'] = { name: closestToPinHole1Winner };
    }
    if (closestToPinHole2Winner) {
      winners['closestToPinHole2'] = { name: closestToPinHole2Winner };
    }

    // 11. Birdie King - all players with at least one birdie or better
    const birdieKingPlayers = players.filter(player =>
      player.stablefordPoints.some(points => points >= 3) // 3+ points means birdie or better
    );
    if (birdieKingPlayers.length > 0) {
      winners['birdieKing'] = {
        name: birdieKingPlayers.map(p => p.name).join(', '),
        isMultiple: true
      };
    }

    // 12. Most Creative Par 3 Award (lowest total Par 3 points)
    // Par 3 holes are: 4, 6, 13, 15 (index 3, 5, 12, 14)
    const par3Holes = [3, 5, 12, 14];
    const par3Sorted = [...players].sort((a, b) => {
      const par3PointsA = par3Holes.reduce((sum, holeIndex) => sum + (a.stablefordPoints[holeIndex] || 0), 0);
      const par3PointsB = par3Holes.reduce((sum, holeIndex) => sum + (b.stablefordPoints[holeIndex] || 0), 0);
      return par3PointsA - par3PointsB; // Lowest points first (worst performance)
    });
    if (par3Sorted.length > 0) {
      winners['par3Creative'] = { name: par3Sorted[0].name };
      if (par3Sorted.length > 1) runnersUp['par3Creative'] = { name: par3Sorted[1].name };
    }

    // 13. "I Don't Care" Award (scores below threshold)
    const lowScorers = players.filter(player => player.totalPoints < iDontCareThreshold);
    if (lowScorers.length > 0) {
      winners['iDontCare'] = {
        name: lowScorers.map(p => p.name).join(', '),
        isMultiple: true
      };
    }

    // 14. Chicken Farmer Award (most bogeys)
    const bogeySorted = [...players].sort((a, b) => {
      const bogeysA = a.stablefordPoints.filter(points => points === 1).length;
      const bogeysB = b.stablefordPoints.filter(points => points === 1).length;
      return bogeysB - bogeysA;
    });
    if (bogeySorted.length > 0) {
      winners['chickenFarmer'] = { name: bogeySorted[0].name };
      if (bogeySorted.length > 1) runnersUp['chickenFarmer'] = { name: bogeySorted[1].name };
    }

    return { winners, runnersUp };
  };

  const { winners, runnersUp } = calculateWinners();

  const getWinnerName = (prizeId: string): string => {
    const override = overrides.find(o => o.prizeId === prizeId);
    if (override) return override.winnerName;
    return winners[prizeId]?.name || '';
  };

  const updateOverride = (prizeId: string, winnerName: string) => {
    setOverrides(prev => {
      const existing = prev.find(o => o.prizeId === prizeId);
      if (existing) {
        return prev.map(o => o.prizeId === prizeId ? { ...o, winnerName } : o);
      } else {
        return [...prev, { prizeId, winnerName }];
      }
    });
  };

  // Initialize overrides with auto-calculated winners on first load
  useEffect(() => {
    // Only initialize if we have players, no existing overrides, no saved settings, and no final winners
    const savedWinnerSettings = localStorage.getItem('icgs-winner-settings');
    const savedFinalWinners = localStorage.getItem('icgs-final-winners');

    if (players.length > 0 && overrides.length === 0 && !savedWinnerSettings && !savedFinalWinners) {
      const { winners: autoWinners } = calculateWinners();
      const initialOverrides: WinnerOverride[] = [];

      Object.entries(autoWinners).forEach(([prizeId, winner]) => {
        if (winner.name && winner.name !== '待确定' && winner.name.trim() !== '') {
          initialOverrides.push({ prizeId, winnerName: winner.name });
        }
      });

      if (initialOverrides.length > 0) {
        setOverrides(initialOverrides);
      }
    }
  }, [players.length]); // Only depend on players.length to avoid circular dependency

  const prizeDefinitions = [
    { id: 'overall1st', title: '第一名', subtitle: '队长杯（轮杯）+ 队长杯纪念奖杯 + 500欧券', mutuallyExclusive: true },
    { id: 'overall2nd', title: '第二名', subtitle: '亚军纪念奖杯 + 300欧券', mutuallyExclusive: true },
    { id: 'overall3rd', title: '第三名', subtitle: '季军纪念奖杯 + 200欧券', mutuallyExclusive: true },
    { id: 'divisionA', title: 'A组冠军', subtitle: '100欧券', mutuallyExclusive: true },
    { id: 'divisionB', title: 'B组冠军', subtitle: '100欧券', mutuallyExclusive: true },
    { id: 'divisionC', title: 'C组冠军', subtitle: '100欧券', mutuallyExclusive: true },
    { id: 'womensChampion', title: '女子组冠军', subtitle: '奖杯 + 80欧券', mutuallyExclusive: true },
    { id: 'front9', title: '前九洞冠军', subtitle: '高尔夫帽子', mutuallyExclusive: true },
    { id: 'back9', title: '后九洞冠军', subtitle: '高尔夫毛巾', mutuallyExclusive: true },
    { id: 'frontBackDiff', title: '前后九洞差距最大', subtitle: '气泡酒', mutuallyExclusive: true },
    { id: 'longestDriveMale', title: '最远开杆奖（男）', subtitle: '奖杯 + 威士忌', manual: true },
    { id: 'longestDriveFemale', title: '最远开杆奖（女）', subtitle: '奖杯 + 威士忌', manual: true },
    { id: 'closestToPinHole1', title: '距离旗杆最近奖（洞1）', subtitle: '奖杯 + 高尔夫球', manual: true },
    { id: 'closestToPinHole2', title: '距离旗杆最近奖（洞2）', subtitle: '奖杯 + 高尔夫球', manual: true },
    { id: 'birdieKing', title: '鸟王奖候选人', subtitle: '嗑瓜子比赛资格（赢烧鸡/奖杯袜子）' },
    { id: 'par3Creative', title: 'Par 3最有个性奖', subtitle: '孔雀开屏开瓶器（Par 3洞总积分最低）' },
    { id: 'iDontCare', title: '爱谁谁我就喜欢不得奖', subtitle: '金铲铲勺子' },
    { id: 'chickenFarmer', title: '养鸡专业户/鹤立鸡群奖', subtitle: '高尔夫推杆杯子' }
  ];

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <Card title="🏆 获奖者预览（奖项互不兼得）">
        <div style={{ marginBottom: theme.spacing.lg }}>
          <p style={{ color: theme.colors.darkGray, fontSize: theme.typography.organizer.body }}>
            以下是根据当前比赛结果自动计算的获奖者。您可以手动修改任何获奖者，修改后的结果将用于最终颁奖页面。
          </p>
        </div>

        {/* Manual Entry Fields */}
        <div style={{ marginBottom: theme.spacing.xl, padding: theme.spacing.lg, backgroundColor: theme.colors.lightGray, borderRadius: '8px' }}>
          <h3 style={{ color: theme.colors.primary, marginBottom: theme.spacing.md }}>手动输入奖项</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.md }}>
            <div>
              <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: 'bold' }}>
                最远开杆奖（男）:
              </label>
              <input
                type="text"
                value={longestDriveMaleWinner}
                onChange={(e) => setLongestDriveMaleWinner(e.target.value)}
                placeholder="输入获奖者姓名"
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.darkGray}`,
                  borderRadius: '4px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: 'bold' }}>
                最远开杆奖（女）:
              </label>
              <input
                type="text"
                value={longestDriveFemaleWinner}
                onChange={(e) => setLongestDriveFemaleWinner(e.target.value)}
                placeholder="输入获奖者姓名"
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.darkGray}`,
                  borderRadius: '4px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: 'bold' }}>
                距离旗杆最近奖 （洞1）:
              </label>
              <input
                type="text"
                value={closestToPinHole1Winner}
                onChange={(e) => setClosestToPinHole1Winner(e.target.value)}
                placeholder="输入获奖者姓名"
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.darkGray}`,
                  borderRadius: '4px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: 'bold' }}>
                距离旗杆最近奖 （洞2）:
              </label>
              <input
                type="text"
                value={closestToPinHole2Winner}
                onChange={(e) => setClosestToPinHole2Winner(e.target.value)}
                placeholder="输入获奖者姓名"
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.darkGray}`,
                  borderRadius: '4px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: 'bold' }}>
                "爱谁谁我就喜欢不得奖"分数门槛:
              </label>
              <input
                type="number"
                value={iDontCareThreshold}
                onChange={(e) => setIDontCareThreshold(parseInt(e.target.value) || 20)}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.darkGray}`,
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Prize Winners Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: theme.spacing.lg }}>
          {prizeDefinitions.map(prize => (
            <div key={prize.id} style={{
              padding: theme.spacing.md,
              border: `2px solid ${theme.colors.primary}`,
              borderRadius: '8px',
              backgroundColor: theme.colors.white
            }}>
              <h3 style={{ color: theme.colors.primary, margin: `0 0 ${theme.spacing.xs} 0` }}>
                {prize.title}
              </h3>
              <p style={{ color: theme.colors.darkGray, fontSize: theme.typography.organizer.small, margin: `0 0 ${theme.spacing.sm} 0` }}>
                {prize.subtitle}
              </p>

              <div style={{ marginBottom: theme.spacing.sm }}>
                <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: 'bold', fontSize: theme.typography.organizer.small }}>
                  获奖者:
                </label>
                <input
                  type="text"
                  value={getWinnerName(prize.id)}
                  onChange={(e) => updateOverride(prize.id, e.target.value)}
                  placeholder="输入获奖者姓名"
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    border: `1px solid ${theme.colors.darkGray}`,
                    borderRadius: '4px',
                    fontSize: theme.typography.organizer.body
                  }}
                />
              </div>

              {runnersUp[prize.id] && (
                <div>
                  <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: 'bold', fontSize: theme.typography.organizer.small }}>
                    亚军:
                  </label>
                  <div style={{
                    padding: theme.spacing.xs,
                    backgroundColor: theme.colors.lightGray,
                    borderRadius: '4px',
                    fontSize: theme.typography.organizer.body
                  }}>
                    {runnersUp[prize.id].name}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: theme.spacing.xl, textAlign: 'center', display: 'flex', gap: theme.spacing.md, justifyContent: 'center' }}>
          <Button
            variant="secondary"
            onClick={() => {
              // Clear all saved settings for testing
              localStorage.removeItem('icgs-winner-settings');
              localStorage.removeItem('icgs-final-winners');

              // Reset all states
              setIDontCareThreshold(20);
              setLongestDriveMaleWinner('');
              setLongestDriveFemaleWinner('');
              setClosestToPinHole1Winner('');
              setClosestToPinHole2Winner('');
              setOverrides([]);

              alert('所有获奖者设置已重置！');
            }}
          >
            重置所有设置
          </Button>

          <Button
            variant="primary"
            size="large"
            onClick={() => {
              // Save final winners to localStorage for the display page
              const finalWinners = prizeDefinitions.map(prize => ({
                id: prize.id,
                title: prize.title,
                subtitle: prize.subtitle,
                winnerName: getWinnerName(prize.id),
                isMultiple: winners[prize.id]?.isMultiple || false
              })).filter(winner => winner.winnerName); // Only include winners with names

              localStorage.setItem('icgs-final-winners', JSON.stringify(finalWinners));

              // Navigate to winners display (this would need to be passed as a prop in real implementation)
              alert('获奖者数据已保存！现在可以查看最终获奖者页面。');
            }}
          >
            生成最终获奖者页面 →
          </Button>
        </div>

        {/* Debug information */}
        <div style={{ marginTop: theme.spacing.lg, padding: theme.spacing.md, backgroundColor: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
          <strong>调试信息:</strong><br />
          玩家数量: {players.length}<br />
          覆盖数量: {overrides.length}<br />
          自动计算获奖者数量: {Object.keys(winners).length}<br />
          是否有最终获奖者列表: {localStorage.getItem('icgs-final-winners') ? '是' : '否'}<br />
          是否有获奖者设置: {localStorage.getItem('icgs-winner-settings') ? '是' : '否'}<br />
          {players.length > 0 && (
            <>
              第一名: {winners['overall1st']?.name || '无'}<br />
              有积分的玩家: {players.filter(p => p.totalPoints > 0).length}<br />
              示例玩家数据: {players[0] ? `${players[0].name} (${players[0].totalPoints}分)` : '无'}<br />
            </>
          )}
          加载逻辑: {localStorage.getItem('icgs-final-winners') ? '从最终获奖者列表加载' : '从自动计算加载'}<br />

          {/* Raw data inspection */}
          <details style={{ marginTop: theme.spacing.sm }}>
            <summary>原始数据检查</summary>
            <div style={{ fontSize: '10px', marginTop: theme.spacing.xs }}>
              localStorage players: {localStorage.getItem('icgs-players') ? '存在' : '不存在'}<br />
              localStorage scores: {localStorage.getItem('icgs-scores') ? '存在' : '不存在'}<br />
              {localStorage.getItem('icgs-scores') && (
                <>
                  Score keys: {Object.keys(JSON.parse(localStorage.getItem('icgs-scores') || '{}')).join(', ')}<br />
                  Player names: {players.map(p => p.name).join(', ')}<br />
                </>
              )}
            </div>
          </details>
        </div>
      </Card>
    </div>
  );
};

export default WinnersPreview;