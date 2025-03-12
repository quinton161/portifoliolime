import React, { useRef } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatIDo from './components/WhatIDo';
import Resume from './components/Resume';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';

const App: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const whatIDoRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Header 
        heroRef={heroRef} 
        whatIDoRef={whatIDoRef} 
        resumeRef={resumeRef} 
        portfolioRef={portfolioRef} 
        contactRef={contactRef} 
      />
      <div ref={heroRef}><Hero /></div>
      <div ref={whatIDoRef}><WhatIDo /></div>
      <div ref={resumeRef}><Resume /></div>
      <div ref={portfolioRef}><Portfolio /></div>
      <div ref={contactRef}><Contact /></div>
    </>
  );
};

export default App;
