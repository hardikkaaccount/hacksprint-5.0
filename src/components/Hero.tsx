import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
}

const Hero = ({ onRegisterClick }: HeroProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[140px] md:pt-[160px]">
      <div className="absolute inset-0 z-0">
        <canvas id="matrix-canvas" className="w-full h-full"></canvas>
      </div>
      
      <div className="relative z-10 text-center px-4">
        {/* National Level Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-semibold tracking-wide uppercase shadow-lg">
            National Level Hackathon
          </span>
        </div>

        <h1 className="neon-text text-4xl md:text-6xl font-bold mb-4">
          HackSprint 5.0
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8">
          Join us for an exciting hackathon experience with amazing prizes and opportunities!
        </p>

        <div className="flex flex-col items-center space-y-8">
          {/* College logo and name */}
          <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
            <img 
              src="/pesce-logo.png" 
              alt="PESCE Logo" 
              className="w-20 h-20 rounded-lg"
            />
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-[#8A8FFF] to-[#00E5FF] text-transparent bg-clip-text text-center md:text-left">
              PES COLLEGE OF ENGINEERING, MANDYA
            </h2>
          </div>

          {/* Venue and date */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2 text-white/80">
              <MapPin className="w-6 h-6 flex-shrink-0" />
              <a 
                href="https://maps.app.goo.gl/kbkR6fB1uxXVvA3N7" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-lg hover:underline hover:decoration-transparent hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-[#B66EFF] hover:to-[#00E5FF]"
              >
                HD Chowdiya Hall, K V Shankaragowda Rd,<br />PES College Campus, Mandya, Karnataka 571401
              </a>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Calendar className="w-6 h-6 flex-shrink-0" />
              <p className="text-lg">May 16-17, 2024</p>
            </div>
          </div>

          {/* Register button */}
          <button 
            onClick={onRegisterClick}
            className="mt-6 px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] text-white hover:opacity-90 transition-opacity transform hover:scale-105 duration-300"
          >
            Register Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
