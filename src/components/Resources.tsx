import React from 'react';
import { FileText, Book, Presentation, Download } from 'lucide-react';

const resources = [
  {
    title: "Problem Statements",
    description: "Problem statements for software and hardware domains for Hacksprint 5.0",
    link: "https://drive.google.com/drive/folders/11mw6_wFKDnQFbNC-HMExjmktOUaj-VQ7?usp=sharing"
  },
  {
    title: "PPT Templates",
    description: "PPT templates for the Idea submission for the hackathon",
    link: "https://drive.google.com/drive/folders/1NHNXRBMk1gtzMSTHOYmDaUomQzZQfLop?usp=sharing"
  },
  {
    title: "Brochure and rulebook",
    description: "Poster, Event Flow, Brochure and rulebook for the hackathon",
    link: "https://drive.google.com/drive/folders/1GEmkZKMEtx66M16Aa2BOdFlRSfaoSlTF?usp=sharing"
  }
];

const Resources = () => {
  return (
    <section className="py-16 relative overflow-hidden" id="resources">
      {/* Background lines effect */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            style={{
              top: `${(i + 1) * 12.5}%`,
              left: '0',
              right: '0',
              transform: `rotate(${i % 2 ? 5 : -5}deg)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="neon-text text-5xl md:text-6xl font-bold text-center mb-16 tracking-normal bg-clip-text text-transparent bg-gradient-to-r from-[#B66EFF] to-[#00E5FF]">
          Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              {/* Enhanced glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              {/* Card content */}
              <div className="relative flex flex-col items-center justify-center p-6 bg-[#0D1117] rounded-2xl backdrop-blur-sm h-full">
                <h3 className="text-xl font-semibold text-white mb-3 text-center">
                  {resource.title}
                </h3>
                <p className="text-white/80 text-center mb-5 text-sm">
                  {resource.description}
                </p>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-full text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources; 