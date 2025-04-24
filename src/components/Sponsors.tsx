import React from 'react';
import { Phone } from 'lucide-react';

const contributingClubs = [
  {
    name: 'IEEE',
    logo: '/ieee.png',
  },
  {
    name: 'ISTE',
    logo: '/iste.png',
  },
  
  {
    name: 'Matrixz',
    logo: '/matrixz.png',
  },
  {
    name: 'Tachyon',
    logo: '/Tachyon_White_nobg.png',
  },
  {
    name: 'DOT',
    logo: '/dot.jpg',
  },
  {
    name: 'FOSS CLUB',
    logo: '/foss.png',
  },
  {
    name: 'Ascend',
    logo: '/Ascend.jpg',
  },
  {
    name: 'Ennovate',
    logo: '/Ennovate.png',
  },
];

const contributors = [
  { name: "Hardik Jain", phone: "+91 6363679655" },
  { name: "VIKAS R P", phone: "+91 8792069009" },
  { name: "Nilesh", phone: "+91 7022216197" },
  { name: "Lakshmi", phone: "+91 7892227374" },
  { name: "Prarthana S", phone: "+91 9632070570" },
  { name: "Meera Devi Raval", phone: "+91 8197883645" },
  { name: "Kunal M K", phone: "+91 7795687774" },
  { name: "Shivam Kumar", phone: "+91 7549603525" },
  { name: "Shubham Jha", phone: "+91 919599031330" },
];

const facultyCoordinators = [
  { name: "Dr. ML Anitha", phone: "+91 9945576186" },
  { name: "Dr. Revanesh M", phone: "+91 9482999222" }
];

const Sponsors = () => {
  return (
    <div className="w-full py-20 relative overflow-hidden" id="sponsors">
      {/* Sponsors Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <h2 className="neon-text text-5xl md:text-6xl font-bold text-center mb-16 tracking-normal">
          Our Knowledge Partners
        </h2>

        <div className="flex justify-center">
          <div className="relative group transform transition-all duration-300 hover:scale-105">
            {/* Enhanced glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt group-hover:animate-pulse"></div>
            
            {/* Card content */}
            <div className="relative flex flex-col items-center justify-center p-8 bg-[#0D1117] rounded-2xl backdrop-blur-sm">
              <div className="w-64 h-64 p-4 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:bg-white/20">
                <img
                  src="/ictacademy.png"
                  alt="ICT Academy logo"
                  className="w-full h-full object-contain filter brightness-110 bg-white border-2 border-white rounded-xl"
                />
              </div>
              <h3 className="mt-4 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] group-hover:text-white transition-colors duration-300">
                ICT Academy
              </h3>
              <p className="mt-4 text-lg text-white/80 text-center max-w-2xl leading-relaxed">
                ICT Academy bridges the gap between industry and academia, offering skill development programs to enhance students' employability and innovation in technology and business.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contributing Clubs Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <h2 className="neon-text text-5xl md:text-6xl font-bold text-center mb-16 tracking-normal">
          Contributing Clubs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contributingClubs.map((club, index) => (
            <div
              key={club.name}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              {/* Enhanced glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt group-hover:animate-pulse"></div>
              
              {/* Card content */}
              <div className="relative flex flex-col items-center justify-center p-8 bg-[#0D1117] rounded-2xl backdrop-blur-sm">
                <div className="w-48 h-48 p-4 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:bg-white/20">
                  <img
                    src={club.logo}
                    alt={`${club.name} logo`}
                    className="w-full h-full object-contain filter brightness-110"
                  />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] group-hover:text-white transition-colors duration-300">
                  {club.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Coordinators Section */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="neon-text text-5xl md:text-6xl font-bold text-center mb-16 tracking-normal">
          Faculty Coordinators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {facultyCoordinators.map((coordinator, index) => (
            <div
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              {/* Enhanced glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              
              {/* Card content */}
              <div className="relative flex flex-col items-center justify-center p-6 bg-[#0D1117] rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {coordinator.name}
                </h3>
                <div className="flex items-center text-white/80 hover:text-[#00E5FF] transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{coordinator.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributors Section */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mt-16 mb-8 text-center">
          Coordinators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contributors.map((contributor, index) => (
            <div
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              {/* Enhanced glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              
              {/* Card content */}
              <div className="relative flex flex-col items-center justify-center p-6 bg-[#0D1117] rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {contributor.name}
                </h3>
                <div className="flex items-center text-white/80 hover:text-[#00E5FF] transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{contributor.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
