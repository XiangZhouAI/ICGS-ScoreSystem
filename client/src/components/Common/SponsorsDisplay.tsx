import React from 'react';
import { theme } from '../../theme';

interface Sponsor {
  name: string;
  logo: string;
  website?: string;
}

interface SponsorsDisplayProps {
  variant?: 'banner' | 'footer' | 'grid';
  showTitle?: boolean;
}

const SPONSORS: Sponsor[] = [
  {
    name: 'SIEC Group',
    logo: '/assets/Sponsors/SIEC_GROUP.jpg',
  },
  {
    name: 'SDeal Construction',
    logo: '/assets/Sponsors/SDealConstruction.jpg',
  },
  {
    name: 'Orient',
    logo: '/assets/Sponsors/Orient Logo.png',
  },
  {
    name: 'Hermitage',
    logo: '/assets/Sponsors/hermitage logo.png',
  },
  {
    name: 'Mini Asia Market',
    logo: '/assets/Sponsors/mini asia market_logo.png',
  },
  {
    name: 'Pocha',
    logo: '/assets/Sponsors/Pocha_logo.png',
  },
  {
    name: '云仟味',
    logo: '/assets/Sponsors/云仟味_logo.png',
  },
];

export const SponsorsDisplay: React.FC<SponsorsDisplayProps> = ({
  variant = 'banner',
  showTitle = true,
}) => {
  const getBannerStyles = () => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: `${theme.spacing.lg} 0`,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    position: 'relative' as const,
  });

  const getFooterStyles = () => ({
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: `${theme.spacing.md} 0`,
    borderTop: `2px solid ${theme.colors.primary}`,
  });

  const getGridStyles = () => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: theme.spacing.xl,
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  });

  const containerStyle = variant === 'banner' ? getBannerStyles() : 
                        variant === 'footer' ? getFooterStyles() : 
                        getGridStyles();

  if (variant === 'banner') {
    return (
      <div style={containerStyle}>
        {showTitle && (
          <h3 style={{
            textAlign: 'center',
            color: theme.colors.primary,
            fontSize: theme.typography.display4K.medium,
            fontWeight: 'bold',
            marginBottom: theme.spacing.lg,
            margin: `0 0 ${theme.spacing.lg} 0`,
          }}>
            Tournament Sponsors
          </h3>
        )}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xl,
          animation: 'scroll-left 30s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {[...SPONSORS, ...SPONSORS].map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
                minWidth: '200px',
                padding: theme.spacing.md,
                backgroundColor: theme.colors.white,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{
                width: '140px',
                height: '100px',
                backgroundColor: theme.colors.lightGray,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: theme.colors.darkGray,
                textAlign: 'center',
                overflow: 'hidden',
              }}>
                {sponsor.logo.endsWith('.png') || sponsor.logo.endsWith('.jpg') ? (
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling!.textContent = sponsor.name;
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '8px', padding: '4px' }}>{sponsor.name}</span>
                )}
                <span style={{ display: 'none' }}></span>
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.colors.primary,
                }}>
                  {sponsor.name}
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div style={containerStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.lg,
          flexWrap: 'wrap',
        }}>
          <span style={{
            color: theme.colors.white,
            fontSize: theme.typography.display4K.small,
            fontWeight: '600',
          }}>
            Sponsored by:
          </span>
          {SPONSORS.slice(0, 4).map((sponsor, index) => (
            <div
              key={sponsor.name}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: theme.colors.white,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                color: theme.colors.primary,
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              {sponsor.logo.endsWith('.png') || sponsor.logo.endsWith('.jpg') ? (
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = sponsor.name.substring(0, 6);
                  }}
                />
              ) : (
                <span>{sponsor.name.substring(0, 6)}</span>
              )}
              <span style={{ display: 'none' }}></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid variant
  return (
    <div style={containerStyle}>
      {showTitle && (
        <h2 style={{
          textAlign: 'center',
          color: theme.colors.primary,
          fontSize: theme.typography.display4K.large,
          fontWeight: 'bold',
          marginBottom: theme.spacing.xl,
        }}>
          Our Generous Sponsors
        </h2>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.lg,
      }}>
        {SPONSORS.map((sponsor) => (
          <div
            key={sponsor.name}
            style={{
              padding: theme.spacing.lg,
              backgroundColor: theme.colors.white,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing.md,
              cursor: sponsor.website ? 'pointer' : 'default',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (sponsor.website) {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => {
              if (sponsor.website) {
                window.open(sponsor.website, '_blank');
              }
            }}
          >
            <div style={{
              width: '220px',
              height: '150px',
              backgroundColor: theme.colors.lightGray,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {sponsor.logo.endsWith('.png') || sponsor.logo.endsWith('.jpg') ? (
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = sponsor.name;
                  }}
                />
              ) : (
                <span style={{ 
                  fontSize: '16px', 
                  color: theme.colors.darkGray,
                  textAlign: 'center',
                  padding: theme.spacing.sm,
                }}>
                  {sponsor.name}
                </span>
              )}
              <span style={{ display: 'none' }}></span>
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.colors.primary,
              textAlign: 'center',
              margin: 0,
            }}>
              {sponsor.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};