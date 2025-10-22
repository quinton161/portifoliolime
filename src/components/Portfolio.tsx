import React from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';
import { FaGithub } from 'react-icons/fa';
import { SiVercel } from 'react-icons/si';
import GlassmorphismCard from './GlassmorphismCard';

const Section = styled.section`
  background: linear-gradient(to bottom right, #000000, #111111);
  padding: 5rem 1rem;
`;

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: white;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: #32CD32;
    margin: 1rem auto;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(GlassmorphismCard)`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/12;
  padding: 0;
  
  @media (min-width: 640px) {
    aspect-ratio: 4/3;
  }
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 1.5rem;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(50, 205, 50, 0.2) 50%, 
    rgba(0, 0, 0, 0.9) 100%
  );
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 2rem;
  border-radius: 1.5rem;
  z-index: 10;
`;

const ProjectTitle = styled.h3`
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  z-index: 15;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProjectDescription = styled.p`
  color: #e5e5e5;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.5;
  z-index: 15;
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  max-width: 280px;
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  z-index: 20;
  position: relative;
`;

const IconLink = styled.a`
  color: white;
  font-size: 1.8rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 25;
  position: relative;
  
  &:hover {
    color: #32CD32;
    transform: translateY(-4px) scale(1.1);
    background: rgba(50, 205, 50, 0.15);
    border-color: rgba(50, 205, 50, 0.3);
    box-shadow: 
      0 8px 20px rgba(50, 205, 50, 0.2),
      0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(-2px) scale(1.05);
  }
`;

interface Project {
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  vercelUrl: string;
}

const Portfolio = () => {
  const renderIcon = (Icon: IconType) => {
    const Component = Icon as React.ComponentType<IconBaseProps>;
    return <Component size={24} />;
  };

  const projects: Project[] = [
    {
      title: "Academy",
      description: "A beautiful and responsive website built with React and TypeScript",
      image: "/images/academ.png",
      githubUrl: " https://quinton161.github.io/myapp/",
      vercelUrl: "https://myapp-nu-seven.vercel.app/"
    },
    {
      title: "All Projects",
      description: "Modern web application with stunning UI/UX design",
      image: "/images/scrum2.png",
      githubUrl: "",
      vercelUrl: "https://scrum2-quinton161s-projects.vercel.app/"
    },
    {
      title: "Trailer Box",
      description: "Watch Trailer for best upcoming movies",
      image: "/images/movie.png",
      githubUrl: "https://github.com/quinton161/trailerbox",
      vercelUrl: "https://trailerbox-tau.vercel.app/react-movie-app"
    },
    {
      title: "Bakers Inn",
      description: "A fresh responsive website with greater user experience",
      image: "/images/bakersInn.png",
      githubUrl: "",
      vercelUrl: "https://bakersinn.vercel.app/"
    },
    {
      title: "Simba",
      description: "Interactive dashboard with real-time data",
      image: "/images/Simba.png",
      githubUrl: "",
      vercelUrl: "https://simba2-lac.vercel.app/"
    },
    {
      title: "NFT",
      description: "Social media platform with modern features",
      image: "/images/NFT.png",
      githubUrl: "",
      vercelUrl: "https://nft-theta-eight.vercel.app/"
    }
  ];

  return (
    <Section>
      <Container>
        <Title>Portfolio</Title>
        <Grid>
          {projects.map((project, index) => (
            <Card key={index} variant="image">
              <ProjectImage src={project.image} alt={project.title} />
              <Overlay className="overlay">
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <IconsContainer>
                  <IconLink 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source on GitHub"
                  >
                    {renderIcon(FaGithub)}
                  </IconLink>
                  {project.vercelUrl && (
                    <IconLink 
                      href={project.vercelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View live demo on Vercel"
                    >
                      {renderIcon(SiVercel)}
                    </IconLink>
                  )}
                </IconsContainer>
              </Overlay>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Portfolio; 
