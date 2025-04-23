import React, { useEffect, useRef, useState } from 'react';
import { Award, Gift, Trophy, Briefcase, Rocket } from 'lucide-react';

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
            Prize Pool
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
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-4">
                <div className={`flex items-center gap-3 transition-all duration-700 delay-300 transform ${animated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  <Trophy className="h-10 w-10 text-yellow-400" />
                  <span className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 text-transparent bg-clip-text">₹60,000</span>
                </div>
                
                <div className={`flex items-center gap-3 transition-all duration-700 delay-500 transform ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <Briefcase className="h-8 w-8 text-cyan-400" />
                  <span className="text-xl md:text-2xl font-bold text-cyan-400">Internship Opportunities</span>
                </div>
                
                <div className={`flex items-center gap-3 transition-all duration-700 delay-700 transform ${animated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                  <Rocket className="h-8 w-8 text-pink-400" />
                  <span className="text-xl md:text-2xl font-bold text-pink-400">Startup Incubation</span>
                </div>
              </div>
              
              <div className={`text-lg md:text-xl text-white/80 mt-4 transition-all duration-500 delay-900 ${animated ? 'opacity-100' : 'opacity-0'}`}>
                Take your project from concept to reality with our comprehensive support system!
              </div>
              
              {/* Animated pulsing border */}
              <div className="absolute inset-0 border border-white/30 rounded-xl pulse-animation"></div>
            </div>
          </div>
{/*           
          <p className="text-white/80 text-xl mb-10">What you can win in this hackathon</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div 
              ref={el => cardsRef.current[0] = el}
              className="bg-black/20 backdrop-blur rounded-lg p-6 border border-white/10 opacity-0 transform translate-y-10 hover:bg-black/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
              style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
            >
              <Award className="mx-auto mb-4 text-prize h-12 w-12 animate-bounce" />
              <h3 className="font-semibold text-white text-lg mb-2">Cash Prizes</h3>
              <p className="text-white/70 text-sm">Win your share of the ₹60,000 prize pool</p>
            </div>
            
            <div 
              ref={el => cardsRef.current[1] = el}
              className="bg-black/20 backdrop-blur rounded-lg p-6 border border-white/10 opacity-0 transform translate-y-10 hover:bg-black/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
              style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
            >
              <Rocket className="mx-auto mb-4 text-prize h-12 w-12 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <h3 className="font-semibold text-white text-lg mb-2">Internship & Startup Incubation</h3>
              <p className="text-white/70 text-sm">Get Internship and Startup Incubation opportunities</p>
            </div>
            
            <div 
              ref={el => cardsRef.current[2] = el}
              className="bg-black/20 backdrop-blur rounded-lg p-6 border border-white/10 opacity-0 transform translate-y-10 hover:bg-black/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
              style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
            >
              <Gift className="mx-auto mb-4 text-prize h-12 w-12 animate-bounce" style={{ animationDelay: '0.4s' }} />
              <h3 className="font-semibold text-white text-lg mb-2">Cool Goodies</h3>
              <p className="text-white/70 text-sm">Take home awesome swag and tech gadgets</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default PrizePool;
