import React from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';
import { FaGithub } from 'react-icons/fa';
import { SiVercel } from 'react-icons/si';

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

const Card = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 16/12;
  
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
  
  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 2rem;
`;

const ProjectTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProjectDescription = styled.p`
  color: #d1d1d1;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const IconsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const IconLink = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #32CD32;
    transform: translateY(-3px);
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
      title: "Daniel.portfolio",
      description: "E-commerce platform with seamless user experience",
      image: "/images/d.png",
      githubUrl: "https://quinton161.github.io/daniel/",
      vercelUrl: "https://daniel-smoky-delta.vercel.app/"
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
            <Card key={index}>
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
