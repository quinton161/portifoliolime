import React from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';
import { FaLaptopCode, FaPalette, FaGlobe, FaCopy, FaCamera, FaChartLine } from 'react-icons/fa';

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

const Card = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 205, 50, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-10px);
    border-color: #32CD32;
    box-shadow: 0 0 20px rgba(50, 205, 50, 0.3);
    
    .icon {
      color: #32CD32;
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
  transition: color 0.3s ease;
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
      title: "UX/UI Design",
      description: "As a UX/UI designer, I craft intuitive and visually engaging experiences that enhance user interaction. I focus on usability, aesthetics, and functionality to create seamless digital products."
    },
 
    {
      icon: FaGlobe,
      title: "Web Design",
      description: "As a web developer, I build modern, user-friendly websites with clean code and great design. I specialize in creating seamless digital experiences that bring ideas to life."
    },
   
   
    {
      icon: FaChartLine,
      title: "Digital Marketing",
      description: "As a digital marketer, I create data-driven strategies to boost brand visibility, engage audiences, and drive conversions through SEO, social media, and targeted campaigns."
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
            <Card key={index}>
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