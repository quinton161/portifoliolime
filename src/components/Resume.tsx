import React, { useState } from 'react';
import styled from 'styled-components';
import GlassmorphismCard from './GlassmorphismCard';

const Section = styled.section`
  background: rgba(0,0,0,0.60);
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
  z-index: 100;
  position: relative;
  text-shadow: 0 4px 24px #000, 0 1px 2px #000, 0 0 2px #32CD32;

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: #32CD32;
    margin: 1rem auto;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Tab = styled.button<{ active?: boolean }>`
  background: ${props => (props.active ? 'rgba(50, 205, 50, 0.18)' : 'rgba(20,20,20,0.55)')};
  color: ${props => (props.active ? '#32CD32' : '#fff')};
  border: 2px solid ${props => (props.active ? '#32CD32' : 'rgba(255, 255, 255, 0.16)')};
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(0,0,0,0.14);
  text-shadow: 0 2px 8px #000, 0 1px 2px #32CD32;
  transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
  cursor: pointer;

  &:hover {
    border-color: #32CD32;
    color: #32CD32;
    background: rgba(50, 205, 50, 0.22);
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SkillCard = styled(GlassmorphismCard)`
  text-align: center;
`;

const SkillTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const SkillDescription = styled.p`
  color: #d1d1d1;
`;

const GroupedSkillsCard = styled(GlassmorphismCard)`
  text-align: center;
`;

const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const EducationCard = styled(GlassmorphismCard)`
  text-align: center;
`;

const EducationTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const EducationDescription = styled.p`
  color: #d1d1d1;
  margin: 0.5rem 0;
`;

const Resume = () => {
  const [activeTab, setActiveTab] = useState('education');

  const skills = [
    { title: 'HTML, CSS, JavaScript', description: 'Fundamental web technologies for building interactive websites.' },
    { title: 'React', description: 'A JavaScript library for building user interfaces, focusing on component-based architecture.' },
    { title: 'TypeScript', description: 'A typed superset of JavaScript that enhances code quality and maintainability.' },
    { title: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development with a focus on customization.' },
    { title: 'Next.js', description: 'A React framework for server-side rendering and static site generation, enhancing performance.' },
    { title: 'Firebase', description: 'A platform developed by Google for building and managing mobile and web applications with real-time databases, authentication, and hosting.' },
    { title: 'MongoDB', description: 'A NoSQL database known for its scalability and flexibility in handling JSON-like documents.' },
  ];

  return (
    <Section>
      <Container>
        <Title>Resume</Title>
        <TabsContainer>
          <Tab active={activeTab === 'education'} onClick={() => setActiveTab('education')}>
            Education
          </Tab>
          <Tab active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>
            Skills
          </Tab>
        </TabsContainer>

        {activeTab === 'education' && (
          <EducationGrid>
            <EducationCard variant="default">
              <EducationTitle>Software Development</EducationTitle>
              <EducationDescription>Uncommon.org, 2024</EducationDescription>
              <EducationDescription>Learned full-stack development with modern technologies.</EducationDescription>
            </EducationCard>
            <EducationCard variant="default">
              <EducationTitle>UI/UX</EducationTitle>
              <EducationDescription>Uncommon.org, 2024</EducationDescription>
              <EducationDescription>Basics.</EducationDescription>
            </EducationCard>
            <EducationCard variant="default">
              <EducationTitle>Digital Marketing</EducationTitle>
              <EducationDescription>Uncommon.org, 2024</EducationDescription>
              <EducationDescription>Gained skills in SEO, content marketing, and analytics.</EducationDescription>
            </EducationCard>
          </EducationGrid>
        )}

        {activeTab === 'skills' && (
          <SkillsGrid>
            <GroupedSkillsCard variant="default">
              <SkillTitle>HTML, CSS, JavaScript</SkillTitle>
              <SkillDescription>Fundamental web technologies for building interactive websites.</SkillDescription>
            </GroupedSkillsCard>
            {skills.slice(1).map((skill, index) => (
              <SkillCard key={index} variant="default">
                <SkillTitle>{skill.title}</SkillTitle>
                <SkillDescription>{skill.description}</SkillDescription>
              </SkillCard>
            ))}
          </SkillsGrid>
        )}
      </Container>
    </Section>
  );
};

export default Resume;
