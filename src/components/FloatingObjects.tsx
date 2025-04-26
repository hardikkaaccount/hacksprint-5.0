import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  Rocket,
  Cpu,
  Brain,
  Globe,
  Zap,
  Sparkles,
  Wifi,
  Cloud,
  Server,
  Smartphone,
  Database,
  Bot
} from 'lucide-react';

const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

const FloatingObjects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Clear any existing objects
    container.innerHTML = '';
    
    // Create an array of icons with more visible colors
    const icons = [
      { component: Rocket, color: 'text-red-400/60' },
      { component: Cpu, color: 'text-blue-400/60' },
      { component: Brain, color: 'text-purple-400/60' },
      { component: Globe, color: 'text-green-400/60' },
      { component: Zap, color: 'text-yellow-400/60' },
      { component: Sparkles, color: 'text-pink-400/60' },
      { component: Wifi, color: 'text-cyan-400/60' },
      { component: Cloud, color: 'text-blue-300/60' },
      { component: Server, color: 'text-indigo-400/60' },
      { component: Smartphone, color: 'text-orange-400/60' },
      { component: Database, color: 'text-amber-500/60' },
      { component: Bot, color: 'text-lime-400/60' }
    ];
    
    // A balanced number of objects
    const numberOfObjects = 15;
    
    for (let i = 0; i < numberOfObjects; i++) {
      const element = document.createElement('div');
      
      // Apply random positioning
      const size = randomFloat(15, 30); // Medium size range
      const x = randomFloat(0, containerWidth - size);
      const y = randomFloat(0, containerHeight - size);
      
      // Apply styles with medium opacity
      element.style.position = 'absolute';
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.opacity = `${randomFloat(0.3, 0.5)}`; // Medium opacity
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
      
      // Apply animation
      const duration = randomFloat(20, 35); // Medium speed animations
      const xMovement = randomFloat(-40, 40);
      const yMovement = randomFloat(-40, 40);
      const rotation = randomFloat(-120, 120);
      
      // Create keyframes animation
      element.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg)', opacity: randomFloat(0.3, 0.4) },
          { transform: `translate(${xMovement}px, ${yMovement}px) rotate(${rotation}deg)`, opacity: randomFloat(0.35, 0.5) },
          { transform: 'translate(0, 0) rotate(0deg)', opacity: randomFloat(0.3, 0.4) }
        ],
        {
          duration: duration * 1000,
          iterations: Infinity,
          direction: 'alternate',
          easing: 'ease-in-out'
        }
      );
    }
    
    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    />
  );
};

export default FloatingObjects;
