import React, { useRef, useState } from "react";
import Header from './components/Header';
import AboutMe from './components/AboutMe';
import WhatIDo from './components/WhatIDo';
import SoftwareServices from './components/SoftwareServices';
import Portfolio from './components/Portfolio';
import Resume from './components/Resume';
import Contact from './components/Contact';
import SplashScreen from './components/SplashScreen';
import VoiceAssistant from './components/VoiceAssistant';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const aboutRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const softwareItRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={`min-h-screen bg-[#F5F5F7] selection:bg-black selection:text-white transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <Header
          heroReady={!showSplash}
          onScrollToAbout={() => scrollToSection(aboutRef)}
          onScrollToPortfolio={() => scrollToSection(portfolioRef)}
          onScrollToServices={() => scrollToSection(servicesRef)}
          onScrollToSoftwareIt={() => scrollToSection(softwareItRef)}
          onScrollToResume={() => scrollToSection(resumeRef)}
          onScrollToContact={() => scrollToSection(contactRef)}
        />
        
        <main>
          <div ref={aboutRef} id="about">
            <AboutMe />
          </div>
          <div ref={servicesRef} id="services">
            <WhatIDo />
          </div>
          <div ref={softwareItRef} id="software-it-wrap">
            <SoftwareServices />
          </div>
          <div ref={portfolioRef} id="projects">
            <Portfolio />
          </div>
          <div ref={resumeRef} id="resume">
            <Resume />
          </div>
          <div ref={contactRef} id="contact">
            <Contact />
          </div>
        </main>

        <Footer
          onScrollToAbout={() => scrollToSection(aboutRef)}
          onScrollToPortfolio={() => scrollToSection(portfolioRef)}
          onScrollToServices={() => scrollToSection(servicesRef)}
          onScrollToSoftwareIt={() => scrollToSection(softwareItRef)}
          onScrollToResume={() => scrollToSection(resumeRef)}
          onScrollToContact={() => scrollToSection(contactRef)}
        />
        <VoiceAssistant siteReady={!showSplash} />
      </div>
    </>
  );
};

export default App;
