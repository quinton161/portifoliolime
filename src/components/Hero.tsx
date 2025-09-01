import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaFacebook, FaDownload, FaSpinner, FaGamepad } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons/lib';

const HeroContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding-top: 4rem;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    min-height: auto;
    padding-bottom: 2rem;
  }
`;

const Content = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  
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

const SideRail = styled.aside`
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  @media (min-width: 1024px) {
    display: flex;
  }
`;

const RailButton = styled.a`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff;
  color: #000;
  transition: all 0.2s ease;
  text-decoration: none;
  &:hover {
    border-color: #32CD32;
    color: #32CD32;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(50,205,50,0.15);
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
  border: 2px solid limegreen;
  border-radius: 1rem;
  transform: translateZ(20px);
  box-shadow: 
    0 0 20px rgba(50, 205, 50, 0.3),
    inset 0 0 20px rgba(50, 205, 50, 0.2);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
`;

const Image = styled.img`
  position: relative;
  z-index: 10;
  width: 80%;
  height: 80%;
  margin: 10%;
  object-fit: contain;
  transform: translateZ(30px);
  filter: drop-shadow(0 10px 20px rgba(50, 205, 50, 0.4));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateZ(40px) scale(1.05);
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
  color: #000;
  
  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const HighlightedText = styled.span`
  color: #32CD32;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #000;
  font-weight: 300;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const Description = styled.p`
  color: #333;
  line-height: 1.625;
  margin-bottom: 2rem;
  max-width: 32rem;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  color: #000;
`;

const Button = styled.a`
  background-color: limegreen;
  color: #000;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s;
  margin-bottom: 2rem;
  box-shadow: 0 0 15px rgba(50, 205, 50, 0.3);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #32CD32;
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(50, 205, 50, 0.5);
  }

  svg {
    font-size: 1.2rem;
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
  color: #000;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #32CD32;
    transform: translateY(-5px);
    filter: drop-shadow(0 0 10px rgba(50, 205, 50, 0.5));
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
    0% { text-shadow: 0 0 10px rgba(50, 205, 50, 0.5); }
    50% { text-shadow: 0 0 20px rgba(50, 205, 50, 0.8), 0 0 30px rgba(50, 205, 50, 0.3); }
    100% { text-shadow: 0 0 10px rgba(50, 205, 50, 0.5); }
  }
`;

interface SocialLink {
  Icon: IconType;
  url: string;
  label: string;
}

const Hero = () => {
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
      url: "https://linkedin.com/in/yourusername",
      label: "LinkedIn Profile"
    },
    {
      Icon: FaFacebook,
      url: "https://facebook.com/yourusername",
      label: "Facebook Profile"
    }
  ];

  return (
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

            <Button 
              href="/cv.pdf"
              onClick={handleDownload}
              aria-label={isDownloading ? 'Downloading CV...' : 'Download CV'}
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
            </Button>

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

            <StatsRow>
              <StatCard>
                <StatLabel>Projects Done</StatLabel>
                <StatValue>59</StatValue>
              </StatCard>
            </StatsRow>
          </TextContent>
        </Grid>
      </Content>

      <SideRail>
        <RailButton href="#" aria-label="GitHub">{renderIcon(FaGithub)}</RailButton>
        <RailButton href="#" aria-label="LinkedIn">{renderIcon(FaLinkedin)}</RailButton>
        <RailButton href="#" aria-label="Facebook">{renderIcon(FaFacebook)}</RailButton>
        <RailButton href="#" aria-label="Games">{renderIcon(FaGamepad)}</RailButton>
      </SideRail>
    </HeroContainer>
  );
};

export default Hero;
