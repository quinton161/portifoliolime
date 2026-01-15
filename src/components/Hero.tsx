import React from "react";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import { motion, easeInOut } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaFacebook, FaDownload, FaSpinner } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons/lib';

// Define keyframes
const backgroundShift = keyframes`
  0%, 100% { 
    background-position: 0% 0%, 0% 0%, 0% 0%;
  }
  33% { 
    background-position: 30% 30%, -20% 20%, 10% -10%;
  }
  66% { 
    background-position: -20% 40%, 40% -30%, -10% 20%;
  }
`;

const floatingParticles = keyframes`
  0% { 
    background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    opacity: 0.6;
  }
  25% { 
    background-position: 25% 25%, -25% 25%, 15% -15%, -15% 15%;
    opacity: 0.8;
  }
  50% { 
    background-position: 50% 50%, -50% 50%, 30% -30%, -30% 30%;
    opacity: 1;
  }
  75% { 
    background-position: 75% 75%, -75% 75%, 45% -45%, -45% 45%;
    opacity: 0.8;
  }
  100% { 
    background-position: 100% 100%, -100% 100%, 60% -60%, -60% 60%;
    opacity: 0.6;
  }
`;

const buttonGlow = keyframes`
  0%, 100% { 
    opacity: 0;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.02);
  }
`;

const HeroContainer = styled.div`
  min-height: 100vh;
  background: transparent;
  padding-top: 4rem;
  position: relative;
  overflow: hidden;
  
  /* Advanced particle background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
      background: 
      radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 20% 80%, rgba(255, 140, 0, 0.03) 0%, transparent 40%),
      radial-gradient(circle at 60% 40%, rgba(255, 200, 0, 0.02) 0%, transparent 30%);
    z-index: 0;
    ${css`
      animation: ${backgroundShift} 20s ease-in-out infinite;
    `}
  }
  
  /* Floating particles */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(255, 165, 0, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 90% 80%, rgba(255, 165, 0, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 30% 60%, rgba(255, 165, 0, 0.06) 1px, transparent 1px),
      radial-gradient(circle at 70% 30%, rgba(255, 165, 0, 0.04) 1px, transparent 1px);
    background-size: 100px 100px, 150px 150px, 80px 80px, 120px 120px;
    z-index: 0;
    ${css`
      animation: ${floatingParticles} 25s linear infinite;
    `}
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    min-height: auto;
    padding-bottom: 2rem;
  }
`;

const Content = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 640px) {
    padding: 4rem 1.5rem;
  }
  
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 2rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 5rem 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  align-items: center;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  aspect-ratio: 1;
  
  @media (min-width: 640px) {
    max-width: 24rem;
  }
  
  @media (min-width: 1024px) {
    max-width: 28rem;
  }
`;

const ImageFrame = styled.div`
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 165, 0, 0.2);
  border-radius: 1.5rem;
  background: rgba(255, 165, 0, 0.06);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, box-shadow, border-color;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(255, 165, 0, 0.04),
    0 0 0 1px rgba(255, 165, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);
  
  /* Subtle light reflection */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    border-radius: 1.5rem 1.5rem 0 0;
    background: linear-gradient(180deg, 
      rgba(255, 255, 255, 0.08) 0%, 
      rgba(255, 255, 255, 0.04) 50%,
      transparent 100%
    );
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover {
    transform: scale(1.02);
    border-color: rgba(255, 165, 0, 0.3);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.12),
      0 8px 20px rgba(255, 165, 0, 0.08),
      0 0 0 1px rgba(255, 165, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.06);
    
    &::before {
      background: linear-gradient(180deg, 
        rgba(255, 255, 255, 0.12) 0%, 
        rgba(255, 255, 255, 0.06) 50%,
        transparent 100%
      );
    }
  }
`;

const Image = styled.img`
  position: relative;
  z-index: 10;
  width: 80%;
  height: 80%;
  margin: 10%;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(255, 165, 0, 0.15));
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, filter;
  
  &:hover {
    transform: scale(1.06) translateY(-2px);
    filter: drop-shadow(0 16px 32px rgba(255, 165, 0, 0.25))
            drop-shadow(0 8px 16px rgba(255, 165, 0, 0.15));
  }
  
  &:active {
    transform: scale(1.04) translateY(-1px);
    transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`;

const TextContent = styled.div`
  text-align: center;
  padding: 0 1rem;
  
  @media (min-width: 768px) {
    text-align: left;
    padding: 0;
  }
`;


const Title = styled.h1`
  font-size: 1.875rem;
  color: white;
  
  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const HighlightedText = styled.span`
  color: #FFA500;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #e0e0e0;
  font-weight: 300;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const Description = styled.p`
  color: #d1d1d1;
  line-height: 1.625;
  margin-bottom: 2rem;
  max-width: 32rem;
`;

const MotionButton = styled(motion.a)`
  background: linear-gradient(135deg, 
    rgba(255, 165, 0, 0.9) 0%,
    rgba(255, 140, 0, 0.8) 100%
  );
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 1rem;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-bottom: 2rem;
  box-shadow: 
    0 8px 25px rgba(255, 165, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: 1px solid rgba(255, 165, 0, 0.2);
  backdrop-filter: blur(16px) saturate(120%);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow, background;
  
  /* Advanced shine and morphing effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.15) 30%,
      rgba(255, 165, 0, 0.1) 50%, 
      rgba(255, 255, 255, 0.15) 70%,
      transparent 100%
    );
    transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: skewX(-20deg);
  }
  
  /* Pulsing glow effect */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      rgba(255, 165, 0, 0.3) 0%,
      rgba(255, 140, 0, 0.2) 100%
    );
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    ${css`
      animation: ${buttonGlow} 3s ease-in-out infinite;
    `}
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.03) rotateX(5deg);
    box-shadow: 
      0 20px 50px rgba(255, 165, 0, 0.22),
      0 12px 25px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 165, 0, 0.3),
      0 0 40px rgba(255, 165, 0, 0.1),
      inset 0 2px 0 rgba(255, 255, 255, 0.22),
      inset 0 -2px 0 rgba(255, 255, 255, 0.08);
    background: linear-gradient(135deg, 
      rgba(255, 165, 0, 1) 0%,
      rgba(255, 140, 0, 0.98) 50%,
      rgba(255, 200, 0, 0.95) 100%
    );
    border-color: rgba(255, 165, 0, 0.4);
    
    &::before {
      left: 100%;
    }
    
    &::after {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
    transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  svg {
    font-size: 1.2rem;
    z-index: 1;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SocialIcon = styled.a`
  color: #fff;
  font-size: 1.5rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  will-change: transform, background, border-color, box-shadow;
  position: relative;
  overflow: hidden;
  
  /* Subtle background glow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 165, 0, 0.05);
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: inherit;
  }
  
  &:hover {
    color: #FFA500;
    transform: translateY(-6px) scale(1.05);
    background: rgba(255, 165, 0, 0.08);
    border-color: rgba(255, 165, 0, 0.25);
    box-shadow: 
      0 12px 30px rgba(255, 165, 0, 0.12),
      0 6px 15px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-4px) scale(1.02);
    transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  svg {
    z-index: 1;
  }
`;

const GlobalStyle = createGlobalStyle`
  @keyframes codeScan {
    0% { transform: translateX(0); }
    100% { transform: translateX(50%); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes glow {
    0% { text-shadow: 0 0 10px rgba(255, 165, 0, 0.5); }
    50% { text-shadow: 0 0 20px rgba(255, 165, 0, 0.8), 0 0 30px rgba(255, 165, 0, 0.3); }
    100% { text-shadow: 0 0 10px rgba(255, 165, 0, 0.5); }
  }
`;

interface SocialLink {
  Icon: IconType;
  url: string;
  label: string;
}

const Hero = () => {
  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeInOut } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: easeInOut } },
  };



  const buttonVariants = {
    rest: { scale: 1, boxShadow: "0 8px 25px rgba(255, 165, 0, 0.12)" },
    hover: { scale: 1.07, boxShadow: "0 12px 40px rgba(255, 165, 0, 0.24)" },
    tap: { scale: 0.97 },
  };

  const [isDownloading, setIsDownloading] = React.useState(false);

  const renderIcon = (IconComponent: IconType) => {
    const Icon = IconComponent as React.ComponentType<IconBaseProps>;
    return <Icon size={24} />;
  };

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDownloading(true);

    try {
      const response = await fetch('/cv.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Green Elegant Professional Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const socialLinks: SocialLink[] = [
    {
      Icon: FaGithub,
      url: "https://github.com/",
      label: "GitHub Profile"
    },
    {
      Icon: FaLinkedin,
      url: "www.linkedin.com/in/quinton-ndlovu-40b559341",
      label: "Quinton Ndlovu"
    },
    {
      Icon: FaFacebook,
      url: "https://facebook.com/yourusername",
      label: "Facebook Profile"
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={heroVariants}
    >
      <HeroContainer>
        <GlobalStyle />
        <Content>
          <Grid>
            <ImageSection>
              <ImageFrame />
              <Image
                src="/images/QUINTON.png"
                alt="3D Coding Icon"
              />
            </ImageSection>

            <TextContent>
              <Title>
                Hi, I am <HighlightedText>Quinton</HighlightedText>
              </Title>
              <Subtitle>Software Developer</Subtitle>
              <Description>
                A passionate web developer with expertise in creating beautiful,
                functional, and user-friendly websites. I specialize in modern
                web technologies and love bringing creative ideas to life.
              </Description>

              <MotionButton
                href="/cv.pdf"
                download
                onClick={handleDownload}
                aria-label={isDownloading ? 'Downloading CV...' : 'Download CV'}
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {isDownloading ? (
                  <>
                    {renderIcon(FaSpinner)}
                    Downloading...
                  </>
                ) : (
                  <>
                    {renderIcon(FaDownload)}
                    Download CV
                  </>
                )}
              </MotionButton>

              <SocialLinks>
                {socialLinks.map(({ Icon, url, label }) => (
                  <SocialIcon
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    {renderIcon(Icon)}
                  </SocialIcon>
                ))}
              </SocialLinks>
            </TextContent>
          </Grid>
        </Content>
      </HeroContainer>
    </motion.div>
  );
};

export default Hero;
