import React from 'react';
import { theme } from '../../theme';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  style = {},
}) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        border: `2px solid ${theme.colors.primary}`,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `2px solid ${theme.colors.primary}`,
      },
      success: {
        backgroundColor: theme.colors.success,
        color: theme.colors.white,
        border: `2px solid ${theme.colors.success}`,
      },
      danger: {
        backgroundColor: theme.colors.warning,
        color: theme.colors.white,
        border: `2px solid ${theme.colors.warning}`,
      },
    };
    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        fontSize: theme.typography.organizer.small,
      },
      medium: {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        fontSize: theme.typography.organizer.body,
      },
      large: {
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        fontSize: theme.typography.organizer.h3,
      },
    };
    return sizes[size];
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: theme.components.button.borderRadius,
        fontWeight: theme.components.button.fontWeight,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = theme.components.card.shadow;
        }
      }}
    >
      {children}
    </button>
  );
};