import React from 'react';
import styled, { css, keyframes } from 'styled-components';

// Define keyframes for modern minimal design
const subtleFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-2px);
  }
`;

const neonGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  50% { 
    box-shadow: 
      0 8px 30px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(99, 102, 241, 0.2),
      0 0 20px rgba(99, 102, 241, 0.1);
  }
`;

const borderShift = keyframes`
  0%, 100% { 
    border-color: rgba(255, 255, 255, 0.1);
  }
  50% { 
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

interface GlassmorphismCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'image' | 'highlight';
  className?: string;
  onClick?: () => void;
  backgroundImage?: string;
  gradientColors?: string[];
}

const CardBase = styled.div<{
  variant: string;
  backgroundImage?: string;
  gradientColors?: string[];
}>`
  position: relative;
  border-radius: 0.75rem;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  will-change: transform, box-shadow, border-color;
  
  /* Modern minimal base */
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  
  /* Geometric accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(99, 102, 241, 0.6) 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 3;
  }
  
  /* Subtle variant backgrounds */
  ${props => {
    switch (props.variant) {
      case 'gradient':
        return css`
          background: linear-gradient(145deg, 
            rgba(99, 102, 241, 0.05) 0%,
            rgba(139, 92, 246, 0.03) 100%
          );
        `;
      case 'highlight':
        return css`
          background: linear-gradient(145deg, 
            rgba(99, 102, 241, 0.08) 0%,
            rgba(139, 92, 246, 0.05) 100%
          );
          border-color: rgba(99, 102, 241, 0.2);
        `;
      case 'image':
        return props.backgroundImage ? css`
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url(${props.backgroundImage});
            background-size: cover;
            background-position: center;
            opacity: 0.1;
            z-index: -1;
          }
        ` : css`
          background: linear-gradient(145deg, 
            rgba(99, 102, 241, 0.04) 0%,
            rgba(139, 92, 246, 0.02) 100%
          );
        `;
      default:
        return css`
          background: linear-gradient(145deg, 
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.01) 100%
          );
        `;
    }
  }}
  
  /* Custom gradient colors if provided */
  ${props => props.gradientColors && css`
    background: linear-gradient(145deg, ${props.gradientColors.join(', ')});
  `}
  
  /* Clean hover effects */
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(99, 102, 241, 0.3),
      0 0 30px rgba(99, 102, 241, 0.1);
    
    &::before {
      opacity: 1;
    }
  }
  
  /* Active state */
  &:active {
    transform: translateY(-4px);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Content positioning */
  > * {
    position: relative;
    z-index: 2;
  }
  
  /* Subtle floating animation */
  ${css`
    animation: ${subtleFloat} 8s ease-in-out infinite;
    animation-delay: ${Math.random() * 4}s;
  `}
  
  /* Neon glow effect */
  ${props => props.variant === 'highlight' && css`
    animation: ${neonGlow} 6s ease-in-out infinite;
  `}
  
  /* Border color animation for gradient variant */
  ${props => props.variant === 'gradient' && css`
    animation: ${borderShift} 4s ease-in-out infinite;
  `}
  
  @media (max-width: 640px) {
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    
    &:hover {
      transform: translateY(-4px);
    }
  }
`;

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  variant = 'default',
  className,
  onClick,
  backgroundImage,
  gradientColors,
  ...props
}) => {
  return (
    <CardBase
      variant={variant}
      backgroundImage={backgroundImage}
      gradientColors={gradientColors}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </CardBase>
  );
};

export default GlassmorphismCard;
