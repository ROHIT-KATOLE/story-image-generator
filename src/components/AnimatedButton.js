import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, borderRadius, transitions, shadows, spacing } from '../GlobalStyles';

// Pulse animation for focus state
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(98, 0, 238, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(98, 0, 238, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(98, 0, 238, 0);
  }
`;

// Scale animation for hover state
const scaleUp = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
`;

const Button = styled.button`
  background-color: ${props => props.$secondary ? colors.secondary : colors.primary};
  color: ${props => props.$secondary ? colors.onSecondary : colors.onPrimary};
  border: none;
  padding: ${spacing.md} ${spacing.xl};
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  font-weight: 600;
  margin: ${spacing.sm};
  cursor: pointer;
  border-radius: ${borderRadius.md};
  transition: ${transitions.medium};
  box-shadow: ${shadows.md};
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  text-transform: ${props => props.$uppercase ? 'uppercase' : 'none'};

  /* Size variants */
  ${props => props.$size === 'small' && `
    padding: ${spacing.xs} ${spacing.md};
    font-size: 0.875rem;
  `}

  ${props => props.$size === 'large' && `
    padding: ${spacing.lg} ${spacing.xxl};
    font-size: 1.125rem;
  `}

  /* Ripple effect */
  &:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.5s, opacity 1s;
  }

  &:active:after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }

  /* Hover state */
  &:hover {
    background-color: ${props => props.$secondary ? 
      'rgba(3, 218, 198, 0.9)' : 
      'rgba(98, 0, 238, 0.9)'};
    box-shadow: ${shadows.lg};
    transform: translateY(-2px);
  }

  /* Focus state */
  &:focus {
    outline: none;
    animation: ${pulse} 1.5s infinite;
  }

  /* Disabled state */
  &:disabled {
    background-color: ${colors.divider};
    color: ${colors.border};
    cursor: not-allowed;
    box-shadow: none;
    &:hover {
      transform: none;
    }
  }

  /* Full width variant */
  ${props => props.$fullWidth && `
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  `}

  /* Outlined variant */
  ${props => props.$outlined && `
    background-color: transparent;
    border: 2px solid ${props.$secondary ? colors.secondary : colors.primary};
    color: ${props.$secondary ? colors.secondary : colors.primary};

    &:hover {
      background-color: ${props.$secondary ? 
        'rgba(3, 218, 198, 0.1)' : 
        'rgba(98, 0, 238, 0.1)'};
    }
  `}
`;

const AnimatedButton = ({
  children,
  onClick,
  secondary = false,
  size = 'medium',
  outlined = false,
  fullWidth = false,
  uppercase = false,
  disabled = false,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      $secondary={secondary}
      $size={size}
      $outlined={outlined}
      $fullWidth={fullWidth}
      $uppercase={uppercase}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AnimatedButton;
