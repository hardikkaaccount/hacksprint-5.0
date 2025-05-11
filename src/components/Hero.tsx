import React from 'react';
import { Calendar, MapPin, Rocket } from 'lucide-react';

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
        
        <p className="text-xl md:text-2xl text-white/90 mb-4">
          Join us for an exciting hackathon experience with amazing prizes and opportunities!
        </p>
        
        {/* Opportunity Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-md rounded-full border border-purple-400/30 shadow-sm">
            <Rocket className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-white">Startup Incubation</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* College logo and name */}
          <div className="flex flex-col md:flex-row items-center justify-center w-full md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex items-center justify-end md:w-1/4 md:pr-4">
              <img 
                src="/pesce-logo.png" 
                alt="PESCE Logo" 
                className="w-20 h-20 rounded-lg"
              />
            </div>
            
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-[#8A8FFF] to-[#00E5FF] text-transparent bg-clip-text text-center md:w-1/2 px-4">
              P. E. S. COLLEGE OF ENGINEERING, MANDYA
            </h2>
            
            <div className="flex items-center justify-start md:w-1/4 md:pl-4">
              <img 
                src="/iic-nobg-2.png" 
                alt="IIC Logo" 
                className="w-20 h-20 rounded-lg"
              />
            </div>
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
                Dr. H. D. Chowdaiah Auditorium, K. V. Shankaragowda Rd,<br />P. E. S. College Campus, Mandya, Karnataka 571401
              </a>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Calendar className="w-6 h-6 flex-shrink-0" />
              <p className="text-lg">May 16-17, 2025</p>
            </div>
          </div>

          {/* Register button */}
          <div className="mt-6 space-y-4">
            <div className="px-6 py-2 text-base font-semibold rounded-full bg-red-600 text-white inline-block">
              Registration Closed
            </div>
            <div className="text-white/80">
              <p className="mb-2 text-lg">Don't miss out on future opportunities! Join our vibrant community of innovators and tech enthusiasts.</p>
              <p className="mb-4 text-sm">Get exclusive updates about upcoming hackathons, workshops, and tech events at PESCE!</p>
              <a 
                href="https://chat.whatsapp.com/G1uQtzYAYQg003BeBNq2qD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors transform hover:scale-105 duration-300 font-semibold shadow-lg hover:shadow-green-500/20"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Join Our Tech Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
