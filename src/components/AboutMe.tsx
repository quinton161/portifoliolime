import React from 'react';
import { 
  SiHtml5, SiCss3, SiJavascript, SiReact, SiTypescript, 
  SiNextdotjs, SiPython, SiPhp, SiFirebase, SiMongodb, SiMysql 
} from 'react-icons/si';

const AboutMe: React.FC = () => {
  const skills = [
    { icon: SiHtml5, color: "#E34F26", label: "HTML5" },
    { icon: SiCss3, color: "#1572B6", label: "CSS3" },
    { icon: SiJavascript, color: "#F7DF1E", label: "JavaScript" },
    { icon: SiReact, color: "#61DAFB", label: "React" },
    { icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
    { icon: SiNextdotjs, color: "#000000", label: "Next.js" },
    { icon: SiPython, color: "#3776AB", label: "Python" },
    { icon: SiPhp, color: "#777BB4", label: "PHP" },
    { icon: SiFirebase, color: "#FFCA28", label: "Firebase" },
    { icon: SiMongodb, color: "#47A248", label: "MongoDB" },
    { icon: SiMysql, color: "#4479A1", label: "MySQL" },
  ];

  return (
    <section id="about" className="bg-white py-24 px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-semibold mb-4 text-center lg:text-left">About Me</h2>
              <p className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] leading-tight text-center lg:text-left">
                Turning complex problems into elegant digital solutions.
              </p>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-center lg:text-left">
              <p>
                Hi, I'm <span className="text-black font-bold text-xl">Quinton Ndlovu</span>, a passionate web developer who enjoys building modern, responsive, and user-friendly web applications.
              </p>
              <p>
                I work with a range of technologies including HTML, CSS, JavaScript, React, TypeScript, Next.js, Python, PHP, Firebase, MongoDB, and MySQL, which allows me to develop both front-end interfaces and back-end systems.
              </p>
              <p>
                In addition to development, I also have experience in design and digital marketing, which helps me understand the full process of building successful digital platforms.
              </p>
            </div>
          </div>

          {/* Animated Skills Grid */}
          <div className="relative">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-6 p-4">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="group relative flex flex-col items-center justify-center p-6 bg-[#F5F5F7] rounded-3xl transition-all duration-500 hover:scale-110 hover:bg-black hover:shadow-xl animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl transition-colors duration-500 group-hover:text-white" style={{ color: skill.color }}>
                    {React.createElement(skill.icon as any)}
                  </div>
                  <span className="absolute -bottom-2 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:bottom-2 text-white transition-all duration-300">
                    {skill.label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F5F5F7] rounded-full -z-10 blur-3xl opacity-50"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F5F5F7] rounded-full -z-10 blur-3xl opacity-50"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}} />
    </section>
  );
};

export default AboutMe;
