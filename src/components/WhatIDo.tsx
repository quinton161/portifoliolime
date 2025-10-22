import React from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';
import { FaLaptopCode, FaPalette, FaGlobe, FaCopy, FaCamera, FaChartLine } from 'react-icons/fa';
import GlassmorphismCard from './GlassmorphismCard';

const Section = styled.section`
  background: linear-gradient(to bottom right, #000000, #111111);
  padding: 5rem 1rem;
  
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 3rem 1rem;  // Reduce padding on tablets
  }
`;

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
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
  text-align: center;
  
  &:hover {
    .icon {
      color: #ff9a00;
      transform: scale(1.1);
    }
  }
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  display: inline-block;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #d1d1d1;
  line-height: 1.6;
`;

interface Service {
  icon: IconType;
  title: string;
  description: string;
}

const WhatIDo = () => {
  const services: Service[] = [
    {
      icon: FaLaptopCode,
      title: "Fronted-End",
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

  const renderIcon = (IconComponent: IconType) => {
    const Icon = IconComponent as React.ComponentType<IconBaseProps>;
    return <Icon size={40} />;
  };

  return (
    <Section>
      <Container>
        <Title>What I Do</Title>
        <Grid>
          {services.map((service, index) => (
            <Card key={index} variant="gradient">
              <IconWrapper className="icon">
                {renderIcon(service.icon)}
              </IconWrapper>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default WhatIDo; 
