import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface QuintonLogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

const geometricPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.3));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.6));
  }
`;

const hexRotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const neonFlicker = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
`;

const LogoContainer = styled.div<{ size: string; animated: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `width: 40px; height: 40px;`;
      case 'large':
        return `width: 80px; height: 80px;`;
      default:
        return `width: 60px; height: 60px;`;
    }
  }}
  
  ${props => props.animated && css`
    animation: ${geometricPulse} 4s ease-in-out infinite;
  `}
  
  &:hover {
    transform: scale(1.05) translateY(-2px);
    
    svg {
      filter: drop-shadow(0 2px 8px rgba(148, 163, 184, 0.4));
    }
  }
  
  &:active {
    transform: scale(1.02) translateY(-1px);
  }
`;

const LogoSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
  
  .q-ring {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-origin: center;
  }
  
  .q-inner {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-origin: center;
  }
  
  .eagle-q {
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-origin: center;
  }
`;

const LogoText = styled.span<{ size: string }>`
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, 
    #6366f1 0%,
    #8b5cf6 50%,
    #a855f7 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 2;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `font-size: 0.875rem;`;
      case 'large':
        return `font-size: 1.5rem;`;
      default:
        return `font-size: 1.125rem;`;
    }
  }}
  
  /* Text shadow for better visibility */
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  
  /* Hover effect */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const NeonGlow = styled.div<{ size: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(139, 92, 246, 0.05) 50%, 
    transparent 100%
  );
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `width: 50px; height: 50px;`;
      case 'large':
        return `width: 100px; height: 100px;`;
      default:
        return `width: 75px; height: 75px;`;
    }
  }}
  
  ${LogoContainer}:hover & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.3);
  }
`;

function QuintonLogo({ 
  size = 'medium', 
  animated = true,
  className 
}: QuintonLogoProps) {
  const logoId = `logo-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <LogoContainer size={size} animated={animated} className={className}>
      <svg width="100%" height="100%" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Advanced metallic gradients */}
          <linearGradient id={`platinum-${logoId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#f8fafc" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="55%" stopColor="#cbd5e1" />
            <stop offset="75%" stopColor="#94a3b8" />
            <stop offset="90%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          
          <linearGradient id={`steel-${logoId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          
          <radialGradient id={`shine-${logoId}`} cx="25%" cy="25%" r="80%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="70%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
          
          {/* Advanced filters */}
          <filter id={`metallic-shadow-${logoId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.4"/>
          </filter>
          
          <filter id={`inner-glow-${logoId}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Professional Eagle Design */}
        
        {/* Eagle Body - Main Structure */}
        <path 
          d="M 60 20 
             L 55 35 
             C 50 40, 45 45, 40 52
             L 35 60
             L 40 65
             C 45 60, 50 55, 55 50
             L 60 65
             L 65 50
             C 70 55, 75 60, 80 65
             L 85 60
             C 80 52, 75 45, 70 40
             L 65 35
             L 60 20 Z"
          fill={`url(#platinum-${logoId})`}
          filter={`url(#metallic-shadow-${logoId})`}
        />
        
        {/* Left Wing - Detailed */}
        <path 
          d="M 40 52 
             C 35 48, 30 45, 25 42
             C 20 40, 15 38, 10 36
             C 8 35, 6 34, 5 33
             C 7 35, 10 37, 15 40
             C 20 43, 25 46, 30 50
             C 35 54, 38 58, 40 62
             L 40 52 Z"
          fill={`url(#steel-${logoId})`}
          filter={`url(#inner-glow-${logoId})`}
        />
        
        {/* Right Wing - Detailed */}
        <path 
          d="M 80 52 
             C 85 48, 90 45, 95 42
             C 100 40, 105 38, 110 36
             C 112 35, 114 34, 115 33
             C 113 35, 110 37, 105 40
             C 100 43, 95 46, 90 50
             C 85 54, 82 58, 80 62
             L 80 52 Z"
          fill={`url(#steel-${logoId})`}
          filter={`url(#inner-glow-${logoId})`}
        />
        
        {/* Eagle Head - Refined */}
        <ellipse 
          cx="60" 
          cy="25" 
          rx="8" 
          ry="10" 
          fill={`url(#platinum-${logoId})`}
          filter={`url(#metallic-shadow-${logoId})`}
        />
        
        {/* Eagle Beak - Sharp and Professional */}
        <path 
          d="M 60 15 L 57 12 L 63 12 L 60 15 Z"
          fill={`url(#steel-${logoId})`}
        />
        
        {/* Eagle Eye */}
        <circle 
          cx="58" 
          cy="23" 
          r="2" 
          fill="#1e293b"
        />
        
        {/* Crown - Royal Design */}
        <path 
          d="M 50 20 L 52 15 L 55 18 L 60 12 L 65 18 L 68 15 L 70 20"
          stroke={`url(#platinum-${logoId})`}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Crown Jewels */}
        <circle cx="60" cy="12" r="1.5" fill="#fbbf24" />
        <circle cx="55" cy="18" r="1" fill="#ef4444" />
        <circle cx="65" cy="18" r="1" fill="#3b82f6" />
        
        {/* Tail Feathers - Detailed */}
        <path 
          d="M 55 65 L 50 80 L 52 85 L 60 75 L 68 85 L 70 80 L 65 65"
          fill={`url(#steel-${logoId})`}
          filter={`url(#inner-glow-${logoId})`}
        />
        
        {/* Wing Details - Feather Lines */}
        <g stroke={`url(#platinum-${logoId})`} strokeWidth="1" fill="none" opacity="0.6">
          <path d="M 15 40 C 25 45, 35 50, 40 55" />
          <path d="M 12 42 C 22 47, 32 52, 37 57" />
          <path d="M 105 40 C 95 45, 85 50, 80 55" />
          <path d="M 108 42 C 98 47, 88 52, 83 57" />
        </g>
        
        {/* Professional Metallic Shine Overlay */}
        <path 
          d="M 60 20 
             L 55 35 
             C 50 40, 45 45, 40 52
             L 35 60
             L 40 65
             C 45 60, 50 55, 55 50
             L 60 65
             L 65 50
             C 70 55, 75 60, 80 65
             L 85 60
             C 80 52, 75 45, 70 40
             L 65 35
             L 60 20 Z"
          fill={`url(#shine-${logoId})`}
          opacity="0.4"
        />
      </svg>
    </LogoContainer>
  );
}

export default QuintonLogo;
