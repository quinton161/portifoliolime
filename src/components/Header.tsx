import React, { useEffect, useRef, useState } from 'react';
import { FaGithub, FaLinkedin, FaFacebook, FaDownload } from 'react-icons/fa';
import QuintonLogo from './QuintonLogo';

function useCountUp(end: number, durationMs: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);
  useEffect(() => {
    if (!enabled) {
      setValue(0);
      return;
    }
    let start: number | null = null;
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / durationMs, 1);
      setValue(Math.round(easeOutCubic(t) * end));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, durationMs, enabled]);
  return value;
}

interface HeaderProps {
  /** When true (splash finished), hero stats animate from 0. */
  heroReady?: boolean;
  onScrollToAbout: () => void;
  onScrollToPortfolio: () => void;
  onScrollToServices: () => void;
  onScrollToSoftwareIt: () => void;
  onScrollToResume: () => void;
  onScrollToContact: () => void;
}

const Header: React.FC<HeaderProps> = ({
  heroReady = false,
  onScrollToAbout,
  onScrollToPortfolio,
  onScrollToServices,
  onScrollToSoftwareIt,
  onScrollToResume,
  onScrollToContact
}) => {
  const projectsCount = useCountUp(200, 1900, heroReady);
  const startupsCount = useCountUp(50, 2100, heroReady);
  const renderIcon = (Icon: any, className?: string, size?: number) => {
    return React.createElement(Icon, { className, size });
  };

  const socialLinks = [
    { icon: FaGithub, url: "https://github.com/", label: "GitHub" },
    { icon: FaLinkedin, url: "https://linkedin.com/in/quinton-ndlovu-40b559341", label: "LinkedIn" },
    { icon: FaFacebook, url: "https://facebook.com/", label: "Facebook" },
  ];

  /** Served from public/images — must match your PDF filename there */
  const cvPdfPath = `${process.env.PUBLIC_URL || ''}/images/Quinton_Ndlovu_CV.pdf`;

  return (
    <section className="min-h-screen bg-[#F5F5F7] flex flex-col p-4 sm:p-8 md:p-12 lg:p-16 font-sans text-[#1D1D1F]">
      {/* Navigation Bar */}
      <nav className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between w-full mb-8 sm:mb-12 min-w-0">
        <button
          type="button"
          className="cursor-pointer shrink-0 text-left p-0 m-0 bg-transparent border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-xl"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Quinton — scroll to top"
        >
          <QuintonLogo variant="header" />
        </button>
        <div className="hidden md:flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-2 text-sm font-semibold text-gray-500">
          <button onClick={onScrollToAbout} className="hover:text-black transition-colors">About Me</button>
          <button onClick={onScrollToPortfolio} className="hover:text-black transition-colors">Portfolio</button>
          <button onClick={onScrollToServices} className="hover:text-black transition-colors">Services</button>
          <button type="button" onClick={onScrollToSoftwareIt} className="hover:text-black transition-colors">
            {'Software & IT'}
          </button>
          <button onClick={onScrollToResume} className="hover:text-black transition-colors">Resume</button>
        </div>
        <div className="flex flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end min-w-0">
          <a
            href={cvPdfPath}
            download="Quinton_Ndlovu_CV.pdf"
            className="flex flex-1 sm:flex-initial min-w-0 items-center justify-center gap-2 bg-white border border-gray-200 px-4 sm:px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all text-xs sm:text-sm font-bold shadow-sm touch-manipulation no-underline text-inherit"
          >
            <span className="truncate">Download CV</span> {renderIcon(FaDownload, "text-xs shrink-0")}
          </a>
          <button
            type="button"
            onClick={onScrollToContact}
            className="flex flex-1 sm:flex-initial min-w-0 justify-center bg-black text-white px-4 sm:px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all text-xs sm:text-sm font-bold shadow-lg shadow-black/10 touch-manipulation"
          >
            <span className="truncate">Book A Call</span> <span className="shrink-0 ml-0.5">↗</span>
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex flex-col lg:flex-row flex-grow items-center justify-between gap-8 sm:gap-12 lg:gap-24 max-w-7xl mx-auto w-full min-w-0">
        <div className="flex-1 space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left min-w-0 px-1">
          <div className="flex justify-center lg:justify-start gap-8 sm:gap-12">
            <div>
              <span className="text-4xl font-bold tracking-tighter italic tabular-nums text-[#1D1D1F]">
                {projectsCount}
                <span className="text-gray-400">+</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-2">Projects Completed</p>
            </div>
            <div>
              <span className="text-4xl font-bold tracking-tighter italic tabular-nums text-[#1D1D1F]">
                {startupsCount}
                <span className="text-gray-400">+</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-2">Startups Raised</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-[min(18vw,10rem)] sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] sm:leading-[0.8] break-words">
              HELLO<span className="text-gray-300">.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-800 px-1 sm:px-0">
              — I'm Quinton, a software developer.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-center lg:items-start justify-center lg:justify-start gap-2 sm:gap-3 pt-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-900">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                Available for freelance work
              </span>
              <span className="text-xs sm:text-sm text-gray-500">Response time: within 24 hours</span>
            </div>
            <div className="flex justify-center lg:justify-start gap-3 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all text-lg shadow-sm"
                  aria-label={social.label}
                >
                  {renderIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Your Portrait Area */}
        <div className="flex-1 flex justify-center lg:justify-end items-center order-1 lg:order-2 w-full min-w-0">
           <div className="relative mx-auto w-52 h-52 min-[400px]:w-60 min-[400px]:h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] max-w-[90vw] animate-float">
             <div className="absolute inset-0 bg-black/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
             <img 
               src="/images/quinton.jpeg" 
               alt="Quinton Ndlovu" 
               className="w-full h-full object-cover rounded-[4rem] grayscale filter contrast-125 z-10 shadow-2xl transition-all duration-700 hover:grayscale-0 hover:scale-[1.02] border-8 border-white"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = '/your-photo-grayscale.png';
               }}
             />
           </div>
           
           <style dangerouslySetInnerHTML={{ __html: `
             @keyframes float {
               0% { transform: translateY(0px) rotate(0deg); }
               50% { transform: translateY(-20px) rotate(2deg); }
               100% { transform: translateY(0px) rotate(0deg); }
             }
             .animate-float {
               animation: float 6s ease-in-out infinite;
             }
           `}} />
        </div>
      </div>
    </section>
  );
};

export default Header;

