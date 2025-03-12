import { useState, RefObject } from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 10px rgba(50, 205, 50, 0.5); }
  50% { text-shadow: 0 0 20px rgba(50, 205, 50, 0.8), 0 0 30px rgba(50, 205, 50, 0.3); }
  100% { text-shadow: 0 0 10px rgba(50, 205, 50, 0.5); }
`;

const HeaderContainer = styled.header`
  position: fixed;
  width: 100%;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 30px rgba(50, 205, 50, 0.1);
  z-index: 50;
  border-bottom: 1px solid rgba(50, 205, 50, 0.2);
`;

const Nav = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5rem;
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const LogoSymbol = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #32CD32;
  animation: ${glowAnimation} 3s infinite;
  font-family: 'Orbitron', sans-serif;
  
  &::before {
    content: '<';
    opacity: 0.7;
  }
  
  &::after {
    content: '/>';
    opacity: 0.7;
  }
`;

const LogoText = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(120deg, #32CD32, #90EE90);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Poppins', sans-serif;
`;

const DesktopMenu = styled.nav`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    gap: 3rem;
  }
`;

const MenuItem = styled.a`
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background: #32CD32;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover {
    color: #32CD32;
    
    &::after {
      width: 100%;
    }
  }
`;

const MobileMenuButton = styled.button`
  color: #32CD32;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(50, 205, 50, 0.2);
  background: rgba(50, 205, 50, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: rgba(50, 205, 50, 0.2);
    border-color: rgba(50, 205, 50, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(50, 205, 50, 0.2);
    
    svg {
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(50, 205, 50, 0.2);
  transform-origin: top;
  transition: all 0.3s ease;
`;

const MobileMenuContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileMenuItem = styled.a`
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    color: #32CD32;
    background: rgba(50, 205, 50, 0.1);
  }
`;

interface HeaderProps {
  heroRef: RefObject<HTMLDivElement | null>;
  whatIDoRef: RefObject<HTMLDivElement | null>;
  resumeRef: RefObject<HTMLDivElement | null>;
  portfolioRef: RefObject<HTMLDivElement | null>;
  contactRef: RefObject<HTMLDivElement | null>;
}

const Header: React.FC<HeaderProps> = ({ heroRef, whatIDoRef, resumeRef, portfolioRef, contactRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#', ref: heroRef },
    { label: 'Services', href: '#', ref: whatIDoRef },
    { label: 'Resume', href: '#', ref: resumeRef },
    { label: 'Portfolio', href: '#', ref: portfolioRef },
    { label: 'Contact', href: '#', ref: contactRef },
  ];

  const scrollToSection = (ref: RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <NavContent>
          <LogoContainer href="/">
            <LogoSymbol>Q</LogoSymbol>
            <LogoText>Quinton</LogoText>
          </LogoContainer>

          <DesktopMenu>
            {menuItems.map((item) => (
              <MenuItem key={item.label} onClick={() => scrollToSection(item.ref)}>
                {item.label}
              </MenuItem>
            ))}
          </DesktopMenu>

          <MobileMenuButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                // X icon when menu is open
                <>
                  <path d="M6 18L18 6" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                // Hamburger icon when menu is closed
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </MobileMenuButton>
        </NavContent>
      </Nav>

      <MobileMenu isOpen={isMenuOpen}>
        <MobileMenuContent>
          {menuItems.map((item) => (
            <MobileMenuItem key={item.label} onClick={() => scrollToSection(item.ref)}>
              {item.label}
            </MobileMenuItem>
          ))}
        </MobileMenuContent>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
