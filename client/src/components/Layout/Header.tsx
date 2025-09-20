import React from 'react';
import { theme } from '../../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showLogo = true 
}) => {
  return (
    <header style={{
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
      color: theme.colors.white,
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      boxShadow: theme.components.card.shadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        {showLogo && (
          <img 
            src="/assets/ICGS_logo.jpg" 
            alt="Ireland Chinese Golf Society"
            style={{ 
              height: '60px', 
              width: 'auto',
              borderRadius: '8px',
              border: `2px solid ${theme.colors.white}`,
            }}
          />
        )}
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: theme.typography.organizer.h1,
            fontWeight: 'bold',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ 
              margin: 0, 
              fontSize: theme.typography.organizer.body,
              opacity: 0.9,
              marginTop: theme.spacing.xs,
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div style={{
        fontSize: theme.typography.organizer.small,
        textAlign: 'right',
        opacity: 0.8,
      }}>
        <div>Luttrellstown Castle Golf Club</div>
        <div>{new Date().toLocaleDateString()}</div>
      </div>
    </header>
  );
};