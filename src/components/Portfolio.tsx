import React from 'react';
import { FaGithub, FaGlobe } from 'react-icons/fa';

const Portfolio: React.FC = () => {
  const projects = [
    {
      title: "Uncommon Attendance",
      description: "A specialized attendance tracking system for educational environments, ensuring accuracy and streamlined management.",
      image: "/images/uncommon.png",
      tags: ["Management", "React", "Firebase"],
      link: "https://uncommonattendance.vercel.app/",
      github: ""
    },
    {
      title: "Academy Learning Platform",
      description: "A comprehensive educational platform built with React and TypeScript, focusing on interactive learning experiences.",
      image: "/images/academ.png",
      tags: ["React", "TypeScript", "Tailwind"],
      link: "https://myapp-nu-seven.vercel.app/",
      github: "https://quinton161.github.io/myapp/"
    },
    {
      title: "Trailer Box",
      description: "Movie discovery application featuring high-quality trailers and real-time movie data integration.",
      image: "/images/movie.png",
      tags: ["React", "API", "Entertainment"],
      link: "https://trailerbox-tau.vercel.app/react-movie-app",
      github: "https://github.com/quinton161/trailerbox"
    },
    {
      title: "Bakers Inn",
      description: "E-commerce solution for a bakery with a focus on seamless user experience and rapid ordering.",
      image: "/images/bakersInn.png",
      tags: ["E-commerce", "UX", "Responsive"],
      link: "https://bakersinn.vercel.app/",
      github: ""
    },
    {
      title: "Simba",
      description: "Interactive dashboard with real-time data visualization and modern UI components.",
      image: "/images/Simba.png",
      tags: ["Dashboard", "Data", "React"],
      link: "https://simba2-lac.vercel.app/",
      github: ""
    },
    {
      title: "Scrum Tool",
      description: "Agile project management tool for tracking sprints and tasks with a clean dashboard interface.",
      image: "/images/scrum2.png",
      tags: ["Agile", "Management", "Dashboard"],
      link: "https://scrum2-quinton161s-projects.vercel.app/",
      github: ""
    },
    {
      title: "TechConnect",
      description: "A professional networking and technology community platform for collaboration and knowledge sharing.",
      image: "/images/TechConnect.png",
      tags: ["Community", "Networking", "React"],
      link: "https://techconnect-hyz3.vercel.app/",
      github: ""
    },
    {
      title: "NFT Marketplace",
      description: "Social media platform for NFTs with modern features and Web3 integration.",
      image: "/images/NFT.png",
      tags: ["Web3", "NFT", "React"],
      link: "https://nft-theta-eight.vercel.app/",
      github: ""
    }
  ];

  const renderIcon = (Icon: any) => {
    return React.createElement(Icon, { size: 20 });
  };

  return (
    <section id="portfolio" className="bg-[#F5F5F7] py-24 px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-semibold mb-4 text-center md:text-left">Portfolio</h2>
          <p className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] max-w-2xl text-center md:text-left">
            Selected works and digital experiments.
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Marquee container */}
          <div className="flex animate-marquee gap-8 py-4">
            {/* Doubled list for seamless loop */}
            {[...projects, ...projects].map((project, index) => (
              <div 
                key={`${project.title}-${index}`} 
                className="flex-shrink-0 w-[300px] md:w-[400px]"
              >
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-transparent hover:border-gray-200 transition-all duration-500 shadow-sm hover:shadow-xl h-full flex flex-col">
                  <div className="aspect-video overflow-hidden bg-gray-100 relative">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Project+Thumbnail';
                      }}
                    />
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex gap-2 mb-4">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider px-3 py-1 bg-[#F5F5F7] text-gray-500 rounded-full font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-[#1D1D1F]">{project.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex gap-4 mt-auto">
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold hover:text-blue-600 transition-colors"
                      >
                        {renderIcon(FaGlobe)} Visit Site
                      </a>
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-semibold hover:text-blue-600 transition-colors"
                        >
                          {renderIcon(FaGithub)} GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default Portfolio;
