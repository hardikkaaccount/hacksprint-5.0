import React, { useEffect, useRef, useState } from 'react';
import { Award, Gift, Trophy, Briefcase, Rocket, Zap } from 'lucide-react';

const PrizePool = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  // Animation state for enhanced prize elements
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      setTimeout(() => {
        titleRef.current!.style.opacity = '1';
        titleRef.current!.style.transform = 'translateY(0)';
      }, 100);
    }

    // Animate cards
    cardsRef.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
      }
    });

    // Trigger enhanced animation for showcase
    setTimeout(() => {
      setAnimated(true);
    }, 500);
    
    // Add pulsing animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
        }
      }
      .pulse-animation {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="py-16 relative" id="prizes">
      <div className="container mx-auto px-4">
        <div className="text-center relative z-10">
          <h2 
            ref={titleRef}
            className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-prize via-yellow-400 to-amber-300 opacity-0 transform -translate-y-10"
            style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
          >
            Prize Pool & Opportunities
          </h2>
          
          {/* Enhanced Prize Pool Showcase - Animated */}
          <div className={`max-w-4xl mx-auto mb-12 transform transition-all duration-1000 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="relative bg-gradient-to-r from-purple-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-[0_0_20px_rgba(137,87,255,0.5)] overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute top-0 left-1/4 w-24 h-24 rounded-full bg-purple-500 blur-xl"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-blue-500 blur-xl"></div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">MASSIVE PRIZE POOL</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-8">
                <div className={`flex items-center gap-3 transition-all duration-700 delay-300 transform ${animated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  <Trophy className="h-10 w-10 text-yellow-400" />
                  <span className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 text-transparent bg-clip-text">₹60,000</span>
                </div>
              </div>
              
              {/* Career Opportunities - Enhanced Section */}
              <div className="bg-black/30 border border-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">CAREER-DEFINING OPPORTUNITIES</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Internship Opportunity */}
                  <div className={`bg-gradient-to-br from-blue-900/50 to-cyan-900/30 border border-blue-500/30 rounded-lg p-4 transform transition-all duration-700 delay-500 ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-blue-500/50 rounded-full mr-3">
                        <Briefcase className="h-8 w-8 text-blue-200" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Internship Placements</h4>
                    </div>
                    <p className="text-blue-200/80 text-left">
                      Top teams will receive internship offers from our industry partners, giving you real-world experience and professional connections.
                    </p>
                  </div>
                  
                  {/* Startup Incubation */}
                  <div className={`bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 transform transition-all duration-700 delay-700 ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-purple-500/50 rounded-full mr-3">
                        <Rocket className="h-8 w-8 text-purple-200" />
                      </div>
                      <h4 className="text-xl font-bold text-white">Startup Incubation</h4>
                    </div>
                    <p className="text-purple-200/80 text-left">
                      Turn your hackathon project into a real business with mentorship, resources, and funding opportunities through our incubation partners.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`text-lg md:text-xl text-white/80 mt-4 transition-all duration-500 delay-900 ${animated ? 'opacity-100' : 'opacity-0'}`}>
                Take your project from concept to reality with our comprehensive support system!
              </div>
              
              {/* Animated pulsing border */}
              <div className="absolute inset-0 border border-white/30 rounded-xl pulse-animation"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizePool;
