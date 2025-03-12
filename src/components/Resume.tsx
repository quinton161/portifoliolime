import React, { useState } from 'react';
import styled from 'styled-components';

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

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Tab = styled.button<{ active?: boolean }>`
  background: ${props => (props.active ? 'rgba(50, 205, 50, 0.1)' : 'transparent')};
  color: ${props => (props.active ? '#32CD32' : '#fff')};
  border: 1px solid ${props => (props.active ? '#32CD32' : 'rgba(255, 255, 255, 0.1)')};
  padding: 0.75rem 2rem;
  border-radius: 2rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #32CD32;
    color: #32CD32;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SkillCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 205, 50, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #32CD32;
    box-shadow: 0 0 20px rgba(50, 205, 50, 0.3);
  }
`;

const SkillTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const SkillDescription = styled.p`
  color: #d1d1d1;
`;

const GroupedSkillsCard = styled(SkillCard)`
  background: rgba(50, 205, 50, 0.1);
`;

const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const EducationCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 205, 50, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #32CD32;
    box-shadow: 0 0 20px rgba(50, 205, 50, 0.3);
  }
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
            <EducationCard>
              <EducationTitle>UI/UX Design</EducationTitle>
              <EducationDescription>Uncommon.org, 2024</EducationDescription>
              <EducationDescription>Focused on user-centered design principles.</EducationDescription>
            </EducationCard>
            <EducationCard>
              <EducationTitle>Web Development</EducationTitle>
              <EducationDescription>Uncommon.org, 2024</EducationDescription>
              <EducationDescription>Learned full-stack development with modern technologies.</EducationDescription>
            </EducationCard>
            <EducationCard>
              <EducationTitle>Digital Marketing</EducationTitle>
              <EducationDescription>Uncommon.org, 2024</EducationDescription>
              <EducationDescription>Gained skills in SEO, content marketing, and analytics.</EducationDescription>
            </EducationCard>
          </EducationGrid>
        )}

        {activeTab === 'skills' && (
          <SkillsGrid>
            <GroupedSkillsCard>
              <SkillTitle>HTML, CSS, JavaScript</SkillTitle>
              <SkillDescription>Fundamental web technologies for building interactive websites.</SkillDescription>
            </GroupedSkillsCard>
            {skills.slice(1).map((skill, index) => (
              <SkillCard key={index}>
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