import React, { useEffect } from 'react';
import { Globe, Cpu, ExternalLink } from 'lucide-react';

// Shared Google Drive URL for all domains
const driveUrl = "https://drive.google.com/drive/folders/11mw6_wFKDnQFbNC-HMExjmktOUaj-VQ7?usp=sharing";

const domains = [
  {
    title: 'Software Development',
    icon: Globe,
    description: 'Build innovative web applications and user experiences',
    color: 'bg-[#BA68C8]',
    delay: 200
  },
  {
    title: 'Hardware Development',
    icon: Cpu,
    description: 'Connect devices and create smart solutions with IoT technologies',
    color: 'bg-[#26A69A]',
    delay: 400
  }
];

const DomainCards = () => {
  // Add the shimmer effect CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .shiny-text-border {
        position: relative;
        display: inline-block;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .shiny-text-border::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 4px;
        background: linear-gradient(45deg, 
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,0) 45%,
          rgba(255,255,255,0.5) 50%,
          rgba(255,255,255,0) 55%,
          rgba(255,255,255,0) 100%);
        z-index: -1;
        background-size: 200% 200%;
        animation: shimmer 6s infinite linear;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full py-20" id="domains">
      {/* Main content */}
      <div className="text-center px-4 max-w-7xl mx-auto">
        <h2 className="neon-text text-5xl md:text-6xl font-bold mb-8">
          Domains to Explore
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-16">
          Choose your domain and showcase your skills
        </p>

        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {domains.map((domain, index) => (
              <a
                key={domain.title}
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-black/40 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-between gap-6 hover:transform hover:scale-105 transition-all duration-300 hover:bg-black/60 border border-transparent hover:border-white/20"
              >
                <div className={`w-20 h-20 rounded-full ${domain.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <domain.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {domain.title}
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-gray-300">{domain.description}</p>
                <span className="shiny-text-border px-4 py-2 text-white group-hover:text-white/95 font-medium transition-colors relative">
                  Click here for problem statements
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainCards;
