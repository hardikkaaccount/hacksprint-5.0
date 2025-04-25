import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Detect if on mobile or lower-end device
    const isMobile = window.innerWidth < 768;
    const isLowPerfDevice = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : true;
    
    // Reduce particle count based on device capabilities
    const particleCount = isMobile || isLowPerfDevice ? 10 : 20;
    const container = containerRef.current;
    
    // Remove any existing particles
    container.innerHTML = '';
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 6 + 2; // Smaller size range
      
      particle.className = 'absolute rounded-full';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Assign random colors
      const colors = ['bg-primary/20', 'bg-secondary/20', 'bg-white/10']; // Reduced opacity and fewer colors
      particle.classList.add(colors[Math.floor(Math.random() * colors.length)]);
      
      // Set initial position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
    }

    // Use Web Animation API with simpler animations
    const animations = Array.from(container.children).map(child => {
      const element = child as HTMLElement;
      
      // Apply random animations with simpler movement
      const randomX = Math.random() * 50 - 25; // Reduced movement range
      const randomY = Math.random() * 50 - 25;
      const duration = 10000 + Math.random() * 10000; // Longer but simpler animations
      
      // Create simpler animation path (only 3 keyframes instead of 5)
      return element.animate([
        { transform: 'translate(0, 0)', opacity: 0.4 },
        { transform: `translate(${randomX}px, ${randomY}px)`, opacity: 0.6 },
        { transform: 'translate(0, 0)', opacity: 0.4 }
      ], {
        duration,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
      });
    });
    
    return () => {
      // Stop all animations on cleanup
      animations.forEach(animation => animation.cancel());
      container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40"
    />
  );
};

export default AnimatedBackground;
