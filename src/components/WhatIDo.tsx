import React from 'react';
import { FaLaptopCode, FaGlobe, FaHeadset } from 'react-icons/fa';

const WhatIDo: React.FC = () => {
  const services = [
    {
      icon: FaLaptopCode,
      title: "Front-End Development",
      description: "Crafting responsive, high-performance user interfaces using React, TypeScript, and modern CSS frameworks like Tailwind."
    },
    {
      icon: FaGlobe,
      title: "Back-End Solutions",
      description: "Building scalable server-side applications, APIs, and database architectures with Node.js and cloud technologies."
    },
    {
      icon: FaHeadset,
      title: "Software & IT Support",
      description:
        "Windows and software setup, troubleshooting, optimization, remote support, and ongoing maintenance alongside product development.",
    }
  ];

  const renderIcon = (Icon: any) => {
    return React.createElement(Icon, { size: 40, className: "text-[#1D1D1F]" });
  };

  return (
    <section id="services" className="bg-white py-24 px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-semibold mb-4">What I Do</h2>
          <p className="text-5xl font-bold tracking-tight text-[#1D1D1F] max-w-2xl">
            Building digital products with purpose and precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div key={index} className="group p-8 rounded-3xl bg-[#F5F5F7] hover:bg-black transition-all duration-500 hover:shadow-2xl">
              <div className="mb-8 p-4 bg-white rounded-2xl inline-block group-hover:bg-[#1D1D1F] transition-colors duration-500">
                {renderIcon(service.icon)}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1D1D1F] group-hover:text-white transition-colors duration-500">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo; 
