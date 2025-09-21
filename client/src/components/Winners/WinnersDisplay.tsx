import React, { useState, useEffect } from 'react';
import { SponsorsDisplay } from '../Common/SponsorsDisplay';
import { theme } from '../../theme';

interface FinalWinner {
  id: string;
  title: string;
  subtitle: string;
  winnerName: string;
  isMultiple?: boolean;
}

const WinnersDisplay: React.FC = () => {
  const [winners, setWinners] = useState<FinalWinner[]>([]);

  // Load winners data from WinnersPreview component results
  useEffect(() => {
    // In a real implementation, this would come from the preview page
    // For now, we'll load from localStorage where preview results are saved
    const savedWinners = localStorage.getItem('icgs-final-winners');
    if (savedWinners) {
      try {
        const winnersData = JSON.parse(savedWinners);
        setWinners(winnersData);
      } catch (error) {
        console.error('Error loading winners data:', error);
        // Fallback to sample data for demo
        setWinners([
          { id: 'overall1st', title: '第一名', subtitle: '队长杯（轮杯）+ 队长杯纪念奖杯 + 500欧券', winnerName: '待确定' },
          { id: 'overall2nd', title: '第二名', subtitle: '亚军纪念奖杯 + 300欧券', winnerName: '待确定' },
          { id: 'overall3rd', title: '第三名', subtitle: '季军纪念奖杯 + 200欧券', winnerName: '待确定' },
        ]);
      }
    }
  }, []);

  const prizeCategories = [
    {
      category: '总体排名奖项',
      color: '#FFD700',
      prizes: winners.filter(w => ['overall1st', 'overall2nd', 'overall3rd'].includes(w.id))
    },
    {
      category: '组别冠军奖项',
      color: '#C0C0C0',
      prizes: winners.filter(w => ['divisionA', 'divisionB', 'divisionC', 'womensChampion'].includes(w.id))
    },
    {
      category: '特殊技能奖项',
      color: '#CD7F32',
      prizes: winners.filter(w => ['longestDriveMale', 'longestDriveFemale', 'closestToPinHole1', 'closestToPinHole2'].includes(w.id))
    },
    {
      category: '洞段表现奖项',
      color: '#4CAF50',
      prizes: winners.filter(w => ['front9', 'back9', 'frontBackDiff'].includes(w.id))
    },
    {
      category: '趣味奖项',
      color: '#FF6B6B',
      prizes: winners.filter(w => ['birdieKing', 'par3Creative', 'iDontCare', 'chickenFarmer'].includes(w.id))
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
      padding: `${theme.spacing.xxl} ${theme.spacing.xl}`,
      color: theme.colors.white
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: theme.spacing.xxl }}>
        <h1 style={{
          fontSize: theme.typography.display4K.hero,
          fontWeight: 'bold',
          margin: `0 0 ${theme.spacing.lg} 0`,
          textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🏆 颁奖典礼 🏆
        </h1>
        <p style={{
          fontSize: theme.typography.display4K.large,
          fontWeight: '300',
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          opacity: 0.9
        }}>
          ICGS 高尔夫锦标赛 • Luttrellstown Castle
        </p>
      </div>

      {/* Winners by Category */}
      {prizeCategories.map((category, categoryIndex) => {
        if (category.prizes.length === 0) return null;

        return (
          <div key={category.category} style={{
            marginBottom: theme.spacing.xxl,
            animation: `fadeInUp 1s ease-in-out ${categoryIndex * 0.2}s both`
          }}>
            {/* Category Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: theme.spacing.xl,
              padding: theme.spacing.lg,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: `3px solid ${category.color}`
            }}>
              <h2 style={{
                fontSize: theme.typography.display4K.large,
                fontWeight: 'bold',
                margin: '0',
                color: category.color,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {category.category}
              </h2>
            </div>

            {/* Prizes Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: category.category === '总体排名奖项' ? '1fr' : 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: theme.spacing.xl,
              marginBottom: theme.spacing.xl,
              maxWidth: category.category === '总体排名奖项' ? '800px' : 'none',
              margin: category.category === '总体排名奖项' ? '0 auto' : '0'
            }}>
              {category.prizes.map((winner, index) => {
                // Special styling for overall ranking prizes
                const isOverallRanking = category.category === '总体排名奖项';
                const rankOrder = isOverallRanking ?
                  (winner.id === 'overall1st' ? 0 : winner.id === 'overall2nd' ? 1 : 2) :
                  index;

                return (
                <div key={winner.id} style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: isOverallRanking ? `${theme.spacing.xxl} ${theme.spacing.xl}` : theme.spacing.xl,
                  borderRadius: '20px',
                  border: `3px solid ${category.color}`,
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `slideInFromLeft 0.8s ease-out ${(categoryIndex * 0.2) + (rankOrder * 0.2)}s both`,
                  transform: isOverallRanking ?
                    (winner.id === 'overall1st' ? 'scale(1.1)' :
                     winner.id === 'overall2nd' ? 'scale(1.05)' : 'scale(1.0)') :
                    'scale(1.0)',
                  marginBottom: isOverallRanking ? theme.spacing.lg : '0'
                }}>
                  {/* Decorative Corner */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `linear-gradient(135deg, ${category.color}40, transparent)`,
                    borderBottomLeftRadius: '100px'
                  }} />

                  {/* Prize Title */}
                  <h3 style={{
                    fontSize: theme.typography.display4K.large,
                    fontWeight: 'bold',
                    margin: `0 0 ${theme.spacing.sm} 0`,
                    color: category.color,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {isOverallRanking && (
                      <span style={{ fontSize: '1.2em', marginRight: theme.spacing.sm }}>
                        {winner.id === 'overall1st' ? '🥇' :
                         winner.id === 'overall2nd' ? '🥈' :
                         winner.id === 'overall3rd' ? '🥉' : ''}
                      </span>
                    )}
                    {winner.title}
                  </h3>

                  {/* Prize Description */}
                  <p style={{
                    fontSize: theme.typography.display4K.small,
                    margin: `0 0 ${theme.spacing.lg} 0`,
                    opacity: 0.9,
                    lineHeight: '1.4'
                  }}>
                    {winner.subtitle}
                  </p>

                  {/* Winner Name(s) */}
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: theme.spacing.lg,
                    borderRadius: '15px',
                    border: `2px solid ${category.color}`,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{
                      fontSize: theme.typography.display4K.medium,
                      fontWeight: 'bold',
                      color: theme.colors.white,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                      wordWrap: 'break-word',
                      lineHeight: '1.2'
                    }}>
                      {winner.winnerName || '待确定'}
                    </div>
                    {winner.isMultiple && winner.winnerName && winner.winnerName.includes(',') && (
                      <div style={{
                        fontSize: theme.typography.display4K.small,
                        opacity: 0.8,
                        marginTop: theme.spacing.sm
                      }}>
                        ({winner.winnerName.split(',').length} 位获奖者)
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Sponsors Section */}
      <div style={{
        marginTop: theme.spacing.xxl,
        marginBottom: theme.spacing.xxl,
        textAlign: 'center'
      }}>
        <div style={{
          padding: theme.spacing.xl,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '3px solid rgba(255,255,255,0.3)',
          marginBottom: theme.spacing.xl
        }}>
          <h2 style={{
            fontSize: theme.typography.display4K.large,
            fontWeight: 'bold',
            margin: `0 0 ${theme.spacing.lg} 0`,
            color: '#FFD700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            🤝 感谢我们的赞助商 🤝
          </h2>
          <p style={{
            fontSize: theme.typography.display4K.small,
            margin: '0',
            opacity: 0.9
          }}>
            本次比赛的成功举办离不开以下赞助商的大力支持
          </p>
        </div>

        {/* Sponsors Display */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: theme.spacing.xl,
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <SponsorsDisplay variant="grid" showTitle={false} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: theme.spacing.xxl,
        padding: theme.spacing.xl,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{
          fontSize: theme.typography.display4K.medium,
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎉 恭喜所有获奖者！ 🎉
        </p>
        <p style={{
          fontSize: theme.typography.display4K.small,
          margin: `${theme.spacing.md} 0 0 0`,
          opacity: 0.9
        }}>
          感谢所有参与者的精彩表现！
        </p>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default WinnersDisplay;