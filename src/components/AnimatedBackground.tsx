
import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create random particles
    const particleCount = 30;
    const container = containerRef.current;
    
    // Remove any existing particles
    container.innerHTML = '';
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 2;
      
      particle.className = 'absolute rounded-full';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Assign random colors
      const colors = ['bg-primary/30', 'bg-secondary/30', 'bg-accent/30', 'bg-white/20', 'bg-purple-400/30', 'bg-indigo-400/30'];
      particle.classList.add(colors[Math.floor(Math.random() * colors.length)]);
      
      // Set initial position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
    }

    // Use Web Animation API for smoother animations
    Array.from(container.children).forEach(child => {
      const element = child as HTMLElement;
      
      // Apply random animations with more interesting movement
      const randomX = Math.random() * 100 - 50;
      const randomY = Math.random() * 100 - 50;
      const duration = 8000 + Math.random() * 12000;
      const delay = Math.random() * 3000;
      
      // Create more complex animation path
      element.animate([
        { transform: 'translate(0, 0) scale(0.8)', opacity: 0.4 },
        { transform: `translate(${randomX * 0.3}px, ${randomY * 0.5}px) scale(1.2)`, opacity: 0.8 },
        { transform: `translate(${randomX}px, ${randomY * 0.8}px) scale(1)`, opacity: 0.6 },
        { transform: `translate(${randomX * 0.6}px, ${randomY}px) scale(1.4)`, opacity: 0.9 },
        { transform: 'translate(0, 0) scale(0.8)', opacity: 0.4 }
      ], {
        duration,
        delay,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
      });
      
      // Add a separate blur animation for some particles
      if (Math.random() > 0.5) {
        element.animate([
          { filter: 'blur(0px)' },
          { filter: 'blur(2px)' },
          { filter: 'blur(0px)' }
        ], {
          duration: duration * 0.7,
          delay: delay * 0.5,
          iterations: Infinity,
          direction: 'alternate',
          easing: 'ease-in-out'
        });
      }
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-60"
    />
  );
};

export default AnimatedBackground;
