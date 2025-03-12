import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';

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

const ContactCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(50, 205, 50, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
  
  @media (min-width: 768px) {
    padding: 3rem;
    grid-template-columns: 1.5fr 1fr;
  }
`;

const FormSection = styled.div`
  flex: 1;
`;

const InfoSection = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    gap: 1.5rem;
  }
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(50, 205, 50, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #32CD32;
    box-shadow: 0 0 10px rgba(50, 205, 50, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  @media (min-width: 640px) {
    padding: 1rem;
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(50, 205, 50, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  color: white;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #32CD32;
    box-shadow: 0 0 10px rgba(50, 205, 50, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  @media (min-width: 640px) {
    min-height: 150px;
  }
`;

const SubmitButton = styled.button`
  background: #32CD32;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2db82d;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(50, 205, 50, 0.3);
  }
`;

const ContactInfo = styled.div`
  h3 {
    color: #32CD32;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #d1d1d1;
    line-height: 1.6;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #32CD32;
    transform: translateY(-3px);
  }
`;

const Contact = () => {
  const renderIcon = (Icon: IconType) => {
    const Component = Icon as React.ComponentType<IconBaseProps>;
    return <Component size={24} />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <Section>
      <Container>
        <Title>Let's talk</Title>
        <ContactCard>
          <FormSection>
            <Form onSubmit={handleSubmit}>
              <Input 
                type="text" 
                placeholder="Your Name" 
                required 
              />
              <Input 
                type="email" 
                placeholder="Your Email" 
                required 
              />
              <TextArea 
                placeholder="Type something if you want..." 
                required 
              />
              <SubmitButton type="submit">
                Send Message
              </SubmitButton>
            </Form>
          </FormSection>
          
          <InfoSection>
            <ContactInfo>
              <h3>Address</h3>
              <p>Nketa, Bulawayo, Zimbabwe</p>
            </ContactInfo>
            
            <ContactInfo>
              <h3>Contact</h3>
              <p>+263 785385293</p>
              <p>quintonndlovu@gmail.com</p>
            </ContactInfo>
            
            <ContactInfo>
              <h3>Follow Me</h3>
              <SocialLinks>
                <SocialIcon href="#" aria-label="Facebook">
                  {renderIcon(FaFacebook)}
                </SocialIcon>
                <SocialIcon href="#" aria-label="Twitter">
                  {renderIcon(FaTwitter)}
                </SocialIcon>
                <SocialIcon href="#" aria-label="Instagram">
                  {renderIcon(FaInstagram)}
                </SocialIcon>
              </SocialLinks>
            </ContactInfo>
          </InfoSection>
        </ContactCard>
      </Container>
    </Section>
  );
};

export default Contact; 