import React, { useState } from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';
import { 
  FaGithub, 
  FaSearch, 
  FaBell, 
  FaHome, 
  FaBriefcase,
  FaFileAlt,
  FaFolder,
  FaEnvelope,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisH,
  FaDownload,
  FaLaptopCode,
  FaGlobe,
  FaChartLine
} from 'react-icons/fa';
import { SiVercel } from 'react-icons/si';

// Import all components
import Hero from './Hero';
import WhatIDo from './WhatIDo';
import Resume from './Resume';
import Contact from './Contact';

const Section = styled.section`
  padding: 2rem 1rem;
  background:
    radial-gradient(circle at top, #111 0%, #000 70%),
    url("/images/dark-fracture.png");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  position: relative;
  
  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`;

const MainContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 1.5rem;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  
  @media (max-width: 1024px) {
    gap: 1rem;
    flex-direction: column;
  }
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const LeftNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0.75rem;
  position: fixed;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  height: fit-content;
  flex-shrink: 0;
  z-index: 2000;
  pointer-events: auto;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileNav = styled.nav`
  display: none;
  
  @media (max-width: 1024px) {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  padding: 1rem;
    background: linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 1.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    position: sticky;
    top: 1rem;
    z-index: 10;
  }
  
  @media (max-width: 640px) {
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 1rem;
  }
`;

const MobileNavIcon = styled.div<{ active?: boolean }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active 
    ? 'linear-gradient(120deg, rgba(255,165,0,0.3) 0%, rgba(255,140,0,0.2) 100%)' 
    : 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'};
  backdrop-filter: blur(20px) saturate(150%);
  border: 1.5px solid ${props => props.active ? 'rgba(255,165,0,0.4)' : 'rgba(255,255,255,0.25)'};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  flex-shrink: 0;
  
  &:hover {
    background: linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%);
    transform: scale(1.1);
    border-color: rgba(255,165,0,0.5);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
`;

const NavIcon = styled.div<{ active?: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active 
    ? 'linear-gradient(120deg, rgba(255,165,0,0.3) 0%, rgba(255,140,0,0.2) 100%)' 
    : 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'};
  backdrop-filter: blur(20px) saturate(150%);
  border: 1.5px solid ${props => props.active ? 'rgba(255,165,0,0.4)' : 'rgba(255,255,255,0.25)'};
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, background, border-color;
  flex-shrink: 0;
  
  &:hover {
    background: linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%);
    transform: scale(1.1);
    border-color: rgba(255,165,0,0.5);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MainPanel = styled.div`
  flex: 1;
  background: linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.2);
  min-width: 0;
  width: calc(100% - 80px);
  box-sizing: border-box;
  position: fixed;
  top: 2rem;
  right: 2rem;
  bottom: 2rem;
  left: 90px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  
  @media (max-width: 1024px) {
    position: relative;
    width: 100%;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
    overflow: visible;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 1.5rem;
  }
  
  @media (max-width: 640px) {
    padding: 1rem;
    border-radius: 1rem;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255,165,0,0.3);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255,165,0,0.5);
    }
  }
`;

const TopNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 640px) {
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
  backdrop-filter: blur(20px) saturate(150%);
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: 1.5rem;
  padding: 0.75rem 1.25rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.95rem;
  min-width: 250px;
  
  svg {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  justify-content: center;
  }
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: 0.6rem 1.2rem;
  border-radius: 1.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(120deg, rgba(255,165,0,0.3) 0%, rgba(255,140,0,0.2) 100%)' 
    : 'linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'};
  backdrop-filter: blur(15px);
  border: 1.5px solid ${props => props.active ? 'rgba(255,165,0,0.4)' : 'rgba(255,255,255,0.2)'};
  color: white;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(120deg, rgba(255,165,0,0.25) 0%, rgba(255,140,0,0.15) 100%);
    border-color: rgba(255,165,0,0.5);
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.25);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.12) 100%);
  }
`;

const ProfileImage = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFA500, #FF8C00);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ProfileText = styled.div`
  display: flex;
  flex-direction: column;

  .name {
  color: white;
    font-size: 0.9rem;
  font-weight: 600;
  }
  
  .username {
    color: rgba(255,255,255,0.6);
    font-size: 0.75rem;
  }
`;

const ContentArea = styled.div`
  min-height: 600px;
  position: relative;
  width: 100%;
  overflow: visible;
  transition: opacity 0.3s ease;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    min-height: 500px;
  }
  
  @media (max-width: 640px) {
    min-height: 400px;
  }
`;

// Wrapper components to adapt existing components to dashboard layout
const DashboardWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  // Override section styles to fit dashboard
  section {
    background: transparent !important;
    padding: 2rem 0 !important;
    min-height: auto !important;
    width: 100% !important;
  }
  
  // Ensure containers fit within dashboard
  div[class*="Container"] {
    max-width: 100% !important;
    padding: 0 !important;
    width: 100% !important;
  }
  
  // Adjust hero container
  div[class*="HeroContainer"] {
    min-height: auto !important;
    padding: 0 !important;
    width: 100% !important;
  }
  
  // Prevent layout shifts
  * {
    box-sizing: border-box;
  }
`;

// Carousel Components
const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 1rem 0 6rem 0;
  box-sizing: border-box;
  min-height: 500px;
  
  @media (max-width: 768px) {
    min-height: 400px;
    padding-bottom: 5rem;
  }
`;

const CarouselTrack = styled.div<{ translateX: number }>`
  display: flex;
  gap: 1.5rem;
  transform: translateX(${props => props.translateX}px);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  width: max-content;
  box-sizing: border-box;
  backface-visibility: hidden;
  perspective: 1000px;
  
  @media (max-width: 640px) {
    gap: 1rem;
  }
`;

const CarouselCard = styled.div`
  width: 320px;
  flex-shrink: 0;
  background: linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.2);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 30px 80px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.3);
  }
  
  @media (max-width: 768px) {
    width: 280px;
    padding: 1.5rem;
  }
  
  @media (max-width: 640px) {
    width: 100%;
    max-width: 320px;
    padding: 1.25rem;
  }
`;

const CarouselNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  position: sticky;
  bottom: 2rem;
  z-index: 10;
  background: linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
  backdrop-filter: blur(20px);
  padding: 1rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  
  @media (max-width: 640px) {
    bottom: 1rem;
    padding: 0.75rem;
  }
`;

const CarouselNavButton = styled.button<{ disabled?: boolean }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => props.disabled 
    ? 'linear-gradient(120deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
    : 'linear-gradient(120deg, rgba(255,165,0,0.3) 0%, rgba(255,140,0,0.2) 100%)'};
  backdrop-filter: blur(20px);
  border: 1.5px solid ${props => props.disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,165,0,0.4)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    background: linear-gradient(120deg, rgba(255,165,0,0.4) 0%, rgba(255,140,0,0.3) 100%);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const CarouselDots = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
`;

const CarouselDot = styled.button<{ active?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active 
    ? 'rgba(255,165,0,0.8)' 
    : 'rgba(255,255,255,0.3)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  
  &:hover {
    background: ${props => props.active 
      ? 'rgba(255,165,0,1)' 
      : 'rgba(255,255,255,0.5)'};
    transform: scale(1.2);
  }
`;

const CarouselTitle = styled.h2`
  color: white;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 4px 24px #000, 0 1px 2px #000, 0 0 2px #FFA500;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: #FFA500;
    margin: 1rem auto;
  }
  
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const CarouselCardIcon = styled.div`
  font-size: 3rem;
  color: #FFA500;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
  
  ${CarouselCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const CarouselCardTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CarouselCardDescription = styled.p`
  color: rgba(255,255,255,0.8);
  line-height: 1.6;
  font-size: 0.95rem;
`;

// Portfolio Projects Section (original portfolio content)
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #FFA500;
  font-weight: 600;
  font-size: 1rem;
  
  svg {
    font-size: 1.2rem;
  }
`;

const NewTrailerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TrailerCard = styled.div`
  display: flex;
  gap: 1rem;
  background: linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
    transform: translateX(5px);
  }
`;

const TrailerImage = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.75rem;
`;

const TrailerContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TrailerTitle = styled.h4`
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
`;

const PlayButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  backdrop-filter: blur(15px);
  border: 1.5px solid rgba(255,255,255,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%);
  }
`;

const FeaturedCard = styled.div`
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  background: linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.2);
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const FeaturedOverlay = styled.div`
    position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);
  padding: 2rem;
  color: white;
`;

const GenreTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const GenreTag = styled.span`
  padding: 0.4rem 0.8rem;
  background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: white;
`;

const FeaturedTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: white;
`;

const FeaturedDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  margin: 1rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
`;

const WatchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(120deg, rgba(255,165,0,0.4) 0%, rgba(255,140,0,0.3) 100%);
  backdrop-filter: blur(15px);
  border: 1.5px solid rgba(255,165,0,0.5);
  border-radius: 1.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(120deg, rgba(255,165,0,0.5) 0%, rgba(255,140,0,0.4) 100%);
    transform: scale(1.05);
  }
`;

const DownloadButton = styled(WatchButton)`
  background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  border-color: rgba(255,255,255,0.3);

  &:hover {
    background: linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%);
  }
`;

const MoreButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  backdrop-filter: blur(15px);
  border: 1.5px solid rgba(255,255,255,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const CarouselControls = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
`;

const CarouselButton = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  backdrop-filter: blur(15px);
  border: 1.5px solid rgba(255,255,255,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContinueWatchingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContinueItem = styled.div`
  display: flex;
  gap: 1rem;
  background: linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
    transform: translateX(5px);
  }
`;

const ContinueImage = styled.img`
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.75rem;
`;

const ContinueContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ContinueTitle = styled.h4`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
`;

const ContinueMeta = styled.div`
  color: rgba(255,255,255,0.6);
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const RecommendationsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SeeAllLink = styled.a`
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const RecommendationCard = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 2/3;
  background: linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: rgba(255,255,255,0.4);
  }
`;

const RecommendationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RecommendationOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${RecommendationCard}:hover & {
    opacity: 1;
  }
`;

const RecommendationGenre = styled(GenreTag)`
  align-self: flex-start;
`;

const RecommendationTitle = styled.h4`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
`;

const RecommendationPlay = styled(PlayButton)`
  align-self: flex-end;
  margin-top: auto;
`;

interface Project {
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  vercelUrl: string;
  genre?: string;
}

type DashboardSection = 'home' | 'services' | 'resume' | 'projects' | 'contact';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');
  const [activeTab, setActiveTab] = useState('Projects');
  const [servicesCarouselIndex, setServicesCarouselIndex] = useState(0);
  const [resumeCarouselIndex, setResumeCarouselIndex] = useState(0);
  const [resumeActiveTab, setResumeActiveTab] = useState<'education' | 'skills'>('education');
  
  const renderIcon = (Icon: IconType, size: number = 24, props?: IconBaseProps) => {
    const Component = Icon as React.ComponentType<IconBaseProps>;
    return <Component size={size} {...props} />;
  };
  
  const services = [
    {
      icon: FaLaptopCode,
      title: "Frontend-End",
      description: "The frontend is the part of the application users interact with directly, built using HTML, CSS, and JavaScript (often with frameworks like React or Vue)."
    },
    {
      icon: FaGlobe,
      title: "Back-end",
      description: "The backend handles business logic, database operations, and server-side processes, typically built using Node.js, Python, or similar technologies."
    },
    {
      icon: FaChartLine,
      title: "Basic skills",
      description: "Skilled in frontend and backend development, with a strong foundation in UX/UI design and digital marketing to build user-friendly, visually engaging, and effectively promoted digital experiences."
    }
  ];
  
  const educationItems: Array<{ title: string; description: string; details?: string }> = [
    { title: 'Software Development', description: 'Uncommon.org, 2024', details: 'Learned full-stack development with modern technologies.' },
    { title: 'UI/UX', description: 'Uncommon.org, 2024', details: 'Basics.' },
    { title: 'Digital Marketing', description: 'Uncommon.org, 2024', details: 'Gained skills in SEO, content marketing, and analytics.' }
  ];
  
  const skills: Array<{ title: string; description: string; details?: string }> = [
    { title: 'HTML, CSS, JavaScript', description: 'Fundamental web technologies for building interactive websites.' },
    { title: 'React', description: 'A JavaScript library for building user interfaces, focusing on component-based architecture.' },
    { title: 'TypeScript', description: 'A typed superset of JavaScript that enhances code quality and maintainability.' },
    { title: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development with a focus on customization.' },
    { title: 'Next.js', description: 'A React framework for server-side rendering and static site generation, enhancing performance.' },
    { title: 'Firebase', description: 'A platform developed by Google for building and managing mobile and web applications with real-time databases, authentication, and hosting.' },
    { title: 'MongoDB', description: 'A NoSQL database known for its scalability and flexibility in handling JSON-like documents.' },
  ];
  
  const [visibleCards, setVisibleCards] = useState(3);
  const cardWidth = 336; // 320px card + 16px gap
  
  React.useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      let cards = 1;
      
      if (width >= 1400) {
        cards = 3;
      } else if (width >= 1024) {
        cards = 2;
      } else if (width >= 768) {
        cards = 2;
      } else {
        cards = 1;
      }
      
      setVisibleCards(cards);
    };
    
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards, { passive: true });
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);
  
  const handleServicesNext = () => {
    const maxIndex = Math.max(0, services.length - visibleCards);
    setServicesCarouselIndex(prev => Math.min(prev + 1, maxIndex));
  };
  
  const handleServicesPrev = () => {
    setServicesCarouselIndex(prev => Math.max(prev - 1, 0));
  };
  
  const handleResumeNext = () => {
    const items = resumeActiveTab === 'education' ? educationItems : skills;
    const maxIndex = Math.max(0, items.length - visibleCards);
    setResumeCarouselIndex(prev => Math.min(prev + 1, maxIndex));
  };
  
  const handleResumePrev = () => {
    setResumeCarouselIndex(prev => Math.max(prev - 1, 0));
  };

  const projects: Project[] = [
    {
      title: "Academy",
      description: "A beautiful and responsive website built with React and TypeScript",
      image: "/images/academ.png",
      githubUrl: "https://quinton161.github.io/myapp/",
      vercelUrl: "https://myapp-nu-seven.vercel.app/",
      genre: "Web App"
    },
    {
      title: "All Projects",
      description: "Modern web application with stunning UI/UX design",
      image: "/images/scrum2.png",
      githubUrl: "",
      vercelUrl: "https://scrum2-quinton161s-projects.vercel.app/",
      genre: "Dashboard"
    },
    {
      title: "Trailer Box",
      description: "Watch Trailer for best upcoming movies",
      image: "/images/movie.png",
      githubUrl: "https://github.com/quinton161/trailerbox",
      vercelUrl: "https://trailerbox-tau.vercel.app/react-movie-app",
      genre: "Entertainment"
    },
    {
      title: "Bakers Inn",
      description: "A fresh responsive website with greater user experience",
      image: "/images/bakersInn.png",
      githubUrl: "",
      vercelUrl: "https://bakersinn.vercel.app/",
      genre: "E-commerce"
    },
    {
      title: "Simba",
      description: "Interactive dashboard with real-time data",
      image: "/images/Simba.png",
      githubUrl: "",
      vercelUrl: "https://simba2-lac.vercel.app/",
      genre: "Dashboard"
    },
    {
      title: "NFT",
      description: "Social media platform with modern features",
      image: "/images/NFT.png",
      githubUrl: "",
      vercelUrl: "https://nft-theta-eight.vercel.app/",
      genre: "Web3"
    }
  ];

  const featuredProject = projects[2];
  const newProjects = projects.slice(0, 2);
  const continueProjects = projects.slice(3, 6);
  const recommendations = projects.slice(0, 4);

  // Reset carousel indices when switching sections
  React.useEffect(() => {
    setServicesCarouselIndex(0);
    setResumeCarouselIndex(0);
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
  return (
          <DashboardWrapper>
            <Hero />
          </DashboardWrapper>
        );
      case 'services':
        return (
          <CarouselContainer>
            <CarouselTitle>What I Do</CarouselTitle>
            <CarouselTrack translateX={-servicesCarouselIndex * cardWidth}>
              {services.map((service, index) => (
                <CarouselCard key={index}>
                  <CarouselCardIcon>
                    {renderIcon(service.icon, 48)}
                  </CarouselCardIcon>
                  <CarouselCardTitle>{service.title}</CarouselCardTitle>
                  <CarouselCardDescription>{service.description}</CarouselCardDescription>
                </CarouselCard>
              ))}
            </CarouselTrack>
            <CarouselNav>
              <CarouselNavButton 
                onClick={handleServicesPrev}
                disabled={servicesCarouselIndex === 0}
              >
                {renderIcon(FaChevronLeft, 20)}
              </CarouselNavButton>
              <CarouselDots>
                {services.map((_, index) => (
                  <CarouselDot
                    key={index}
                    active={index === servicesCarouselIndex}
                    onClick={() => setServicesCarouselIndex(index)}
                  />
                ))}
              </CarouselDots>
              <CarouselNavButton 
                onClick={handleServicesNext}
                disabled={servicesCarouselIndex >= services.length - visibleCards}
              >
                {renderIcon(FaChevronRight, 20)}
              </CarouselNavButton>
            </CarouselNav>
          </CarouselContainer>
        );
      case 'resume':
        const resumeItems = resumeActiveTab === 'education' ? educationItems : skills;
        return (
          <CarouselContainer>
            <CarouselTitle>Resume</CarouselTitle>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              marginBottom: '2rem',
              background: 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(20px)',
              padding: '1rem',
              borderRadius: '1.5rem',
              border: '1px solid rgba(255,255,255,0.1)'
            } as React.CSSProperties}>
              <Tab 
                active={resumeActiveTab === 'education'} 
                onClick={() => {
                  setResumeActiveTab('education');
                  setResumeCarouselIndex(0);
                }}
              >
                Education
              </Tab>
              <Tab 
                active={resumeActiveTab === 'skills'} 
                onClick={() => {
                  setResumeActiveTab('skills');
                  setResumeCarouselIndex(0);
                }}
              >
                Skills
              </Tab>
            </div>
            <CarouselTrack translateX={-resumeCarouselIndex * cardWidth}>
              {resumeItems.map((item, index) => (
                <CarouselCard key={index}>
                  <CarouselCardTitle>{item.title}</CarouselCardTitle>
                  <CarouselCardDescription style={{ color: '#FFA500', marginBottom: '0.5rem' } as React.CSSProperties}>
                    {item.description}
                  </CarouselCardDescription>
                  {item.details && (
                    <CarouselCardDescription>{item.details}</CarouselCardDescription>
                  )}
                </CarouselCard>
              ))}
            </CarouselTrack>
            <CarouselNav>
              <CarouselNavButton 
                onClick={handleResumePrev}
                disabled={resumeCarouselIndex === 0}
              >
                {renderIcon(FaChevronLeft, 20)}
              </CarouselNavButton>
              <CarouselDots>
                {resumeItems.map((_, index) => (
                  <CarouselDot
                    key={index}
                    active={index === resumeCarouselIndex}
                    onClick={() => setResumeCarouselIndex(index)}
                  />
                ))}
              </CarouselDots>
              <CarouselNavButton 
                onClick={handleResumeNext}
                disabled={resumeCarouselIndex >= resumeItems.length - visibleCards}
              >
                {renderIcon(FaChevronRight, 20)}
              </CarouselNavButton>
            </CarouselNav>
          </CarouselContainer>
        );
      case 'projects':
        return (
          <>
            <ContentGrid>
              <NewTrailerSection>
                <SectionTitle>
                  <span>✨</span>
                  <span>New Projects</span>
                </SectionTitle>
                {newProjects.map((project, index) => (
                  <TrailerCard key={index}>
                    <TrailerImage src={project.image} alt={project.title} />
                    <TrailerContent>
                      <TrailerTitle>{project.title}</TrailerTitle>
                      <PlayButton 
                        onClick={() => window.open(project.vercelUrl || project.githubUrl, '_blank')}
                      >
                        {renderIcon(FaPlay, 10, { style: { marginLeft: '2px' } })}
                      </PlayButton>
                    </TrailerContent>
                  </TrailerCard>
                ))}
              </NewTrailerSection>

              <div>
                <SectionTitle>
                  <span>🔥</span>
                  <span>Featured Project</span>
                </SectionTitle>
                <FeaturedCard>
                  <FeaturedImage src={featuredProject.image} alt={featuredProject.title} />
                  <FeaturedOverlay>
                    <GenreTags>
                      <GenreTag>{featuredProject.genre}</GenreTag>
                      <GenreTag>React</GenreTag>
                    </GenreTags>
                    <FeaturedTitle>{featuredProject.title}</FeaturedTitle>
                    <FeaturedDescription>{featuredProject.description}</FeaturedDescription>
                    <ActionButtons>
                      <WatchButton 
                        onClick={() => window.open(featuredProject.vercelUrl || featuredProject.githubUrl, '_blank')}
                      >
                        {renderIcon(FaPlay, 16)}
                        <span>View</span>
                      </WatchButton>
                      <DownloadButton 
                        onClick={() => window.open(featuredProject.githubUrl, '_blank')}
                      >
                        {renderIcon(FaDownload, 16)}
                        <span>Code</span>
                      </DownloadButton>
                      <MoreButton>
                        {renderIcon(FaEllipsisH, 18)}
                      </MoreButton>
                    </ActionButtons>
                  </FeaturedOverlay>
                  <CarouselControls>
                    <CarouselButton>{renderIcon(FaChevronLeft, 16)}</CarouselButton>
                    <CarouselButton>{renderIcon(FaChevronRight, 16)}</CarouselButton>
                  </CarouselControls>
                </FeaturedCard>
              </div>
            </ContentGrid>

            <BottomSection>
              <ContinueWatchingSection>
                <SectionTitle>
                  <span>📺</span>
                  <span>Recent Projects</span>
                </SectionTitle>
                {continueProjects.map((project, index) => (
                  <ContinueItem key={index}>
                    <ContinueImage src={project.image} alt={project.title} />
                    <ContinueContent>
                      <div>
                        <ContinueTitle>{project.title}</ContinueTitle>
                        <ContinueMeta>{project.genre} • Live Demo</ContinueMeta>
                      </div>
                      <PlayButton 
                        onClick={() => window.open(project.vercelUrl || project.githubUrl, '_blank')}
                  >
                        {renderIcon(FaPlay, 10, { style: { marginLeft: '2px' } })}
                      </PlayButton>
                    </ContinueContent>
                  </ContinueItem>
                ))}
              </ContinueWatchingSection>

              <RecommendationsSection>
                <SectionHeader>
                  <SectionTitle>
                    <span>💡</span>
                    <span>You might like</span>
                  </SectionTitle>
                  <SeeAllLink href="#">See all</SeeAllLink>
                </SectionHeader>
                <RecommendationsGrid>
                  {recommendations.map((project, index) => (
                    <RecommendationCard 
                      key={index}
                      onClick={() => window.open(project.vercelUrl || project.githubUrl, '_blank')}
                    >
                      <RecommendationImage src={project.image} alt={project.title} />
                      <RecommendationOverlay>
                        <RecommendationGenre>{project.genre}</RecommendationGenre>
                        <RecommendationTitle>{project.title}</RecommendationTitle>
                        <RecommendationPlay>
                          {renderIcon(FaPlay, 10, { style: { marginLeft: '2px' } })}
                        </RecommendationPlay>
                      </RecommendationOverlay>
                    </RecommendationCard>
                  ))}
                </RecommendationsGrid>
              </RecommendationsSection>
            </BottomSection>
          </>
        );
      case 'contact':
        return (
          <DashboardWrapper>
            <Contact />
          </DashboardWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <Section>
      <MainContainer>
        <LeftNav>
          <NavIcon 
            active={activeSection === 'home'} 
            onClick={() => setActiveSection('home')}
            title="Home"
          >
            {renderIcon(FaHome, 20)}
          </NavIcon>
          <NavIcon 
            active={activeSection === 'services'} 
            onClick={() => setActiveSection('services')}
            title="Services"
          >
            {renderIcon(FaBriefcase, 20)}
          </NavIcon>
          <NavIcon 
            active={activeSection === 'resume'} 
            onClick={() => setActiveSection('resume')}
            title="Resume"
          >
            {renderIcon(FaFileAlt, 20)}
          </NavIcon>
          <NavIcon 
            active={activeSection === 'projects'} 
            onClick={() => setActiveSection('projects')}
            title="Projects"
          >
            {renderIcon(FaFolder, 20)}
          </NavIcon>
          <NavIcon 
            active={activeSection === 'contact'} 
            onClick={() => setActiveSection('contact')}
            title="Contact"
          >
            {renderIcon(FaEnvelope, 20)}
          </NavIcon>
        </LeftNav>

        <MainPanel>
          <MobileNav>
            <MobileNavIcon 
              active={activeSection === 'home'} 
              onClick={() => setActiveSection('home')}
              title="Home"
            >
              {renderIcon(FaHome, 18)}
            </MobileNavIcon>
            <MobileNavIcon 
              active={activeSection === 'services'} 
              onClick={() => setActiveSection('services')}
              title="Services"
                    >
              {renderIcon(FaBriefcase, 18)}
            </MobileNavIcon>
            <MobileNavIcon 
              active={activeSection === 'resume'} 
              onClick={() => setActiveSection('resume')}
              title="Resume"
            >
              {renderIcon(FaFileAlt, 18)}
            </MobileNavIcon>
            <MobileNavIcon 
              active={activeSection === 'projects'} 
              onClick={() => setActiveSection('projects')}
              title="Projects"
            >
              {renderIcon(FaFolder, 18)}
            </MobileNavIcon>
            <MobileNavIcon 
              active={activeSection === 'contact'} 
              onClick={() => setActiveSection('contact')}
              title="Contact"
            >
              {renderIcon(FaEnvelope, 18)}
            </MobileNavIcon>
          </MobileNav>
          <TopNav>
            <SearchBar>
              {renderIcon(FaSearch, 16)}
              <span>Search {activeSection === 'home' ? 'portfolio' : activeSection}</span>
            </SearchBar>
            
            {activeSection === 'projects' && (
              <CategoryTabs>
                <Tab active={activeTab === 'Projects'} onClick={() => setActiveTab('Projects')}>
                  Projects
                </Tab>
                <Tab active={activeTab === 'Web Apps'} onClick={() => setActiveTab('Web Apps')}>
                  Web Apps
                </Tab>
                <Tab active={activeTab === 'Dashboards'} onClick={() => setActiveTab('Dashboards')}>
                  Dashboards
                </Tab>
                <Tab active={activeTab === 'E-commerce'} onClick={() => setActiveTab('E-commerce')}>
                  E-commerce
                </Tab>
                <Tab active={activeTab === 'More'} onClick={() => setActiveTab('More')}>
                  More
                </Tab>
              </CategoryTabs>
            )}
            
            <ProfileSection>
              <NotificationIcon>
                {renderIcon(FaBell, 18)}
              </NotificationIcon>
              <ProfileInfo>
                <ProfileImage>Q</ProfileImage>
                <ProfileText>
                  <div className="name">Quinton</div>
                  <div className="username">@quinton161</div>
                </ProfileText>
              </ProfileInfo>
            </ProfileSection>
          </TopNav>

          <ContentArea>
            {renderContent()}
          </ContentArea>
        </MainPanel>
      </MainContainer>
    </Section>
  );
};

export default Portfolio; 
