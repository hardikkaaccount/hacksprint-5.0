import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  Code2, 
  Cpu, 
  Globe, 
  Rocket, 
  Server
} from 'lucide-react';

const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

const FloatingObjects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Detect device capabilities
    const isMobile = window.innerWidth < 768;
    const isLowPerfDevice = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : true;
    
    const container = containerRef.current;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Clear any existing objects
    container.innerHTML = '';
    
    // Create an array of icons to use - reduced number of icon types
    const icons = [
      { component: Code2, color: 'text-purple-400' },
      { component: Cpu, color: 'text-red-400' },
      { component: Globe, color: 'text-cyan-400' },
      { component: Rocket, color: 'text-orange-400' },
      { component: Server, color: 'text-indigo-400' }
    ];
    
    // Create objects - significantly fewer objects based on device performance
    const numberOfObjects = isMobile || isLowPerfDevice ? 5 : 8;
    const animations = [];
    
    for (let i = 0; i < numberOfObjects; i++) {
      const element = document.createElement('div');
      
      // Apply random positioning
      const size = randomFloat(20, 35); // Smaller size range
      const x = randomFloat(0, containerWidth - size);
      const y = randomFloat(0, containerHeight - size);
      
      // Apply styles
      element.style.position = 'absolute';
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.opacity = `${randomFloat(0.2, 0.5)}`; // Reduced opacity
      element.style.zIndex = '1';
      element.style.pointerEvents = 'none';
      
      // Choose a random icon
      const { component: Icon, color } = icons[Math.floor(Math.random() * icons.length)];
      
      // Create a container for the icon
      const iconContainer = document.createElement('div');
      iconContainer.style.transform = `rotate(${Math.random() * 360}deg)`;
      element.appendChild(iconContainer);
      
      // Render the icon using ReactDOM
      const iconElement = React.createElement(Icon, { 
        className: color, 
        size: size,
        style: { width: '100%', height: '100%' }
      });
      ReactDOM.render(iconElement, iconContainer);
      
      // Add to container
      container.appendChild(element);
      
      // Apply simpler animation
      const duration = randomFloat(20, 35); // Longer, slower animation
      const xMovement = randomFloat(-30, 30); // Less movement
      const yMovement = randomFloat(-30, 30);
      
      // Create simpler keyframes animation with fewer keyframes
      const animation = element.animate(
        [
          { transform: 'translate(0, 0)', opacity: randomFloat(0.2, 0.4) },
          { transform: `translate(${xMovement}px, ${yMovement}px)`, opacity: randomFloat(0.3, 0.5) },
          { transform: 'translate(0, 0)', opacity: randomFloat(0.2, 0.4) }
        ],
        {
          duration: duration * 1000,
          iterations: Infinity,
          direction: 'alternate',
          easing: 'ease-in-out'
        }
      );
      
      animations.push(animation);
    }
    
    return () => {
      // Cancel all animations on cleanup
      animations.forEach(animation => animation.cancel());
      container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-70"
    />
  );
};

export default FloatingObjects;
