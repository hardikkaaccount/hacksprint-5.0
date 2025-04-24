import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-scroll';
import { ExternalLink, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Domains', href: 'domains' },
  { name: 'Resources', href: 'resources' },
  { name: 'Timeline', href: 'timeline' },
  { name: 'Sponsors', href: 'sponsors' },
  { name: 'Contact', href: 'footer' },
];

// News items with emojis
const newsItems = [
  { emoji: '🔔', text: 'ALERT: Registration has opened - closes on 5th May 2025!', href: 'hero', isInternal: true },
  { emoji: '📢', text: 'ANNOUNCEMENT: Problem statements are out!!', href: "https://drive.google.com/drive/folders/16YYXYgJk1_GMYizsdVapQzZe7Z4jy4mw?usp=sharing", isInternal: false },
  { emoji: '📝', text: 'Download PPT template for submissions', href: "https://drive.google.com/drive/folders/16YYXYgJk1_GMYizsdVapQzZe7Z4jy4mw?usp=sharing", isInternal: false }
];

const Header = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Google Drive URL for all announcements
  const driveUrl = "https://drive.google.com/drive/folders/16YYXYgJk1_GMYizsdVapQzZe7Z4jy4mw?usp=sharing";

  useEffect(() => {
    if (titleRef.current && navRef.current) {
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.style.opacity = '1';
          titleRef.current.style.transform = 'translateX(0)';
        }
      }, 100);

      setTimeout(() => {
        if (navRef.current) {
          navRef.current.style.opacity = '1';
          navRef.current.style.transform = 'translateY(0)';
        }
      }, 300);
    }

    // Add animation CSS for the news ticker
    const style = document.createElement('style');
    style.textContent = `
      @keyframes marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      .animate-marquee {
        animation: marquee 30s linear infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full fixed top-0 z-50 flex flex-col">
      {/* Main Navbar */}
      <div className="w-full bg-[#0D1117]/80 backdrop-blur-md py-6 text-white">
        <div className="w-full px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left side - Logo and Title */}
            <div 
              ref={titleRef}
              className="flex items-center space-x-4 opacity-0 transform -translate-x-10"
              style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
            >
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#B66EFF] via-[#8A8FFF] to-[#00E5FF] text-transparent bg-clip-text">
                HackSprint 5.0
              </span>
            </div>
            
            {/* Right side - Desktop Navigation */}
            <div 
              ref={navRef}
              className="hidden md:flex space-x-8 opacity-0 transform translate-y-4"
              style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
            >
              {navigation.map((item) => (
                <Link 
                  key={item.name}
                  to={item.href} 
                  spy={true} 
                  smooth={true} 
                  offset={-100} 
                  duration={500}
                  className="cursor-pointer text-lg text-white/80 hover:text-[#00E5FF] transition-all duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-white/80 hover:text-[#00E5FF] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-black/90 backdrop-blur-md z-40">
          <div className="pt-4 pb-3 px-4 space-y-1 flex flex-col">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="text-white py-3 px-4 text-lg border-l-2 border-transparent hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors duration-300"
                onClick={handleLinkClick}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* News Ticker */}
      <div className="w-full bg-gradient-to-r from-purple-800 via-blue-700 to-purple-800">
        <div className="ticker-container overflow-hidden whitespace-nowrap py-2 px-4">
          <div className="ticker-content inline-block animate-marquee">
            {/* First set of news items */}
            {newsItems.map((item, index) => (
              item.isInternal ? (
                <Link 
                  key={index}
                  to={item.href}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={500}
                  className="inline-flex items-center mx-8 font-medium text-white hover:text-yellow-200 transition-colors cursor-pointer"
                >
                  <span className="text-xl mr-2">{item.emoji}</span>
                  <span className="font-semibold">{item.text}</span>
                </Link>
              ) : (
                <a 
                  key={index} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mx-8 font-medium text-white hover:text-yellow-200 transition-colors"
                >
                  <span className="text-xl mr-2">{item.emoji}</span>
                  <span className="font-semibold">{item.text}</span>
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              )
            ))}
            {/* Repeat for continuous flow */}
            {newsItems.map((item, index) => (
              item.isInternal ? (
                <Link 
                  key={index + newsItems.length}
                  to={item.href}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={500}
                  className="inline-flex items-center mx-8 font-medium text-white hover:text-yellow-200 transition-colors cursor-pointer"
                >
                  <span className="text-xl mr-2">{item.emoji}</span>
                  <span className="font-semibold">{item.text}</span>
                </Link>
              ) : (
                <a 
                  key={index + newsItems.length} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mx-8 font-medium text-white hover:text-yellow-200 transition-colors"
                >
                  <span className="text-xl mr-2">{item.emoji}</span>
                  <span className="font-semibold">{item.text}</span>
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
