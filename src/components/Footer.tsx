import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="footer" className="w-full bg-[#0D1117]/80 backdrop-blur-sm">
      <div className="w-full px-4 md:px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          {/* Title Section */}
          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#B66EFF] via-[#8A8FFF] to-[#00E5FF] text-transparent bg-clip-text">
            Get In Touch
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Have questions about HackSprint 5.0? Reach out to us through these channels
          </p>

          {/* Social Links Grid */}
          <div className="flex justify-center items-center gap-4 mb-16">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/hacksprint5.0?utm_source=qr&igsh=ODY2YTNoeGV3anY1"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="relative w-[3.375rem] h-[3.375rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-md opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative h-full bg-[#0D1117] rounded-md flex items-center justify-center p-3 group-hover:bg-black/50 transition duration-300">
                  <Instagram className="w-6 h-6 text-white group-hover:scale-110 transition duration-300" />
                </div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/106708236/admin/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="relative w-[3.375rem] h-[3.375rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-md opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative h-full bg-[#0D1117] rounded-md flex items-center justify-center p-3 group-hover:bg-black/50 transition duration-300">
                  <Linkedin className="w-6 h-6 text-white group-hover:scale-110 transition duration-300" />
                </div>
              </div>
            </a>

            

            {/* Email */}
            <a
              href="mailto:hacksprint5.0@gmail.com"
              className="group"
            >
              <div className="relative w-[3.375rem] h-[3.375rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B66EFF] to-[#00E5FF] rounded-md opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative h-full bg-[#0D1117] rounded-md flex items-center justify-center p-3 group-hover:bg-black/50 transition duration-300">
                  <Mail className="w-6 h-6 text-white group-hover:scale-110 transition duration-300" />
                </div>
              </div>
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 py-8">
              <p>© 2025 HackSprint 5.0 | <a href="https://pesce.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">PES College of Engineering, Mandya</a></p>
              <p className="text-sm mt-2 md:mt-0">Crafted with 💜 by Srinidhi</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
