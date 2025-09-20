import React from 'react';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  style = {},
  padding = 'lg',
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.components.card.borderRadius,
        boxShadow: theme.components.card.shadow,
        border: `1px solid ${theme.colors.lightGray}`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {title && (
        <div style={{
          padding: `${theme.spacing.md} ${theme.spacing[padding]}`,
          borderBottom: `1px solid ${theme.colors.lightGray}`,
          backgroundColor: theme.colors.lightGray,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: theme.typography.organizer.h3,
            color: theme.colors.primary,
            fontWeight: 'bold',
          }}>
            {title}
          </h3>
        </div>
      )}
      <div style={{
        padding: theme.spacing[padding],
      }}>
        {children}
      </div>
    </div>
  );
};