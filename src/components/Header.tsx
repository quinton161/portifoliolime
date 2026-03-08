import React from 'react';
import { FaGithub, FaLinkedin, FaFacebook, FaDownload } from 'react-icons/fa';

interface HeaderProps {
  onScrollToAbout: () => void;
  onScrollToPortfolio: () => void;
  onScrollToServices: () => void;
  onScrollToResume: () => void;
  onScrollToContact: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onScrollToAbout,
  onScrollToPortfolio,
  onScrollToServices,
  onScrollToResume,
  onScrollToContact
}) => {
  const renderIcon = (Icon: any, className?: string, size?: number) => {
    return React.createElement(Icon, { className, size });
  };

  const socialLinks = [
    { icon: FaGithub, url: "https://github.com/", label: "GitHub" },
    { icon: FaLinkedin, url: "https://linkedin.com/in/quinton-ndlovu-40b559341", label: "LinkedIn" },
    { icon: FaFacebook, url: "https://facebook.com/", label: "Facebook" },
  ];

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/cv.pdf';
    link.download = 'Quinton_Ndlovu_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-screen bg-[#F5F5F7] flex flex-col p-8 md:p-12 lg:p-16 font-sans text-[#1D1D1F]">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center w-full mb-12">
        <div className="font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Quinton</div>
        <div className="space-x-8 hidden md:flex text-sm font-semibold text-gray-500">
          <button onClick={onScrollToAbout} className="hover:text-black transition-colors">About Me</button>
          <button onClick={onScrollToPortfolio} className="hover:text-black transition-colors">Portfolio</button>
          <button onClick={onScrollToServices} className="hover:text-black transition-colors">Services</button>
          <button onClick={onScrollToResume} className="hover:text-black transition-colors">Resume</button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all text-sm font-bold shadow-sm"
          >
            Download CV {renderIcon(FaDownload, "text-xs")}
          </button>
          <button onClick={onScrollToContact} className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all text-sm font-bold shadow-lg shadow-black/10">
            Book A Call ↗
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex flex-col lg:flex-row flex-grow items-center justify-between gap-12 lg:gap-24 max-w-7xl mx-auto w-full">
        <div className="flex-1 space-y-8 order-2 lg:order-1 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-12">
            <div>
              <span className="text-4xl font-bold tracking-tighter italic">200+</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-2">Projects Completed</p>
            </div>
            <div>
              <span className="text-4xl font-bold tracking-tighter italic">50+</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-2">Startups Raised</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.8]">
              HELLO<span className="text-gray-300">.</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-gray-800">— I'm Quinton, a software developer.</p>
            
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
        <div className="flex-1 flex justify-center lg:justify-end items-center order-1 lg:order-2 w-full">
           <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] animate-float">
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

