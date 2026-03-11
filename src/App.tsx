import React, { useRef, useState } from "react";
import Header from './components/Header';
import AboutMe from './components/AboutMe';
import WhatIDo from './components/WhatIDo';
import Portfolio from './components/Portfolio';
import Resume from './components/Resume';
import Contact from './components/Contact';
import SplashScreen from './components/SplashScreen';
import VoiceAssistant from './components/VoiceAssistant';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const aboutRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
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
          onScrollToAbout={() => scrollToSection(aboutRef)}
          onScrollToPortfolio={() => scrollToSection(portfolioRef)}
          onScrollToServices={() => scrollToSection(servicesRef)}
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

        <footer className="bg-white py-12 px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="font-bold text-xl tracking-tighter text-black">Quinton</div>
            <p className="text-gray-500 text-sm">© 2024 Quinton Ndlovu. All rights reserved.</p>
            <div className="flex gap-8 text-sm font-medium text-gray-500">
              <span className="hover:text-black transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-black transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </footer>
        <VoiceAssistant />
      </div>
    </>
  );
};

export default App;
