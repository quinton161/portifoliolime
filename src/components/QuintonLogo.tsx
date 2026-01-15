import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const geometricPulse = keyframes`
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.3)); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.6)); }
`;

const LogoContainer = styled.div<{ size: string; animated: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: ${({ size }) => size === 'small' ? '40px' : size === 'large' ? '80px' : '60px'};
  height: ${({ size }) => size === 'small' ? '40px' : size === 'large' ? '80px' : '60px'};
  ${({ animated }) => animated && css`animation: ${geometricPulse} 4s ease-in-out infinite;`}
  &:hover { transform: scale(1.05) translateY(-2px); }
  &:active { transform: scale(1.02) translateY(-1px); }
`;

interface QuintonLogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

const QuintonLogo: React.FC<QuintonLogoProps> = ({ size = 'medium', animated = true, className }) => (
  <LogoContainer size={size} animated={animated} className={className}>
    <svg width="100%" height="100%" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#6366f1" fillOpacity="0.12" />
      <ellipse cx="60" cy="60" rx="40" ry="48" fill="#fff" fillOpacity="0.18" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="bold" fontSize="32" fill="#6366f1" opacity="0.85">Q</text>
    </svg>
  </LogoContainer>
);

export default QuintonLogo;