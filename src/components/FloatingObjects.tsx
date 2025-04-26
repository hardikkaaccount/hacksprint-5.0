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
    
    // Create a grid-based layout for more even distribution
    const numberOfObjects = 16; // 4x4 grid works well
    
    // Calculate grid dimensions based on the number of objects
    // We'll create a square grid (4x4, 5x5, etc.) that best fits our desired object count
    const gridSize = Math.ceil(Math.sqrt(numberOfObjects));
    const cellWidth = containerWidth / gridSize;
    const cellHeight = containerHeight / gridSize;
    
    // Create objects in a grid-based pattern with some randomness
    let objectsCreated = 0;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (objectsCreated >= numberOfObjects) break;
        
        const element = document.createElement('div');
        
        // Apply positioning within the current grid cell (with some randomness)
        const size = randomFloat(15, 30);
        
        // Position within current grid cell with padding to avoid edges
        const cellPadding = Math.min(cellWidth, cellHeight) * 0.2;
        const x = (col * cellWidth) + randomFloat(cellPadding, cellWidth - cellPadding - size);
        const y = (row * cellHeight) + randomFloat(cellPadding, cellHeight - cellPadding - size);
        
        // Apply styles with medium opacity
        element.style.position = 'absolute';
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = `${randomFloat(0.3, 0.5)}`;
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
        
        // Apply animation - with more contained movement within its cell
        const movementRange = Math.min(cellWidth, cellHeight) * 0.3;
        const duration = randomFloat(16, 30); // Slightly faster animations
        const xMovement = randomFloat(-movementRange, movementRange);
        const yMovement = randomFloat(-movementRange, movementRange);
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
        
        objectsCreated++;
      }
    }
    
    // Add resize handler to reposition objects when window size changes
    const handleResize = () => {
      // Clear and recreate the objects on resize
      container.innerHTML = '';
      setTimeout(() => {
        if (containerRef.current) {
          const newContainer = containerRef.current;
          const newContainerWidth = window.innerWidth;
          const newContainerHeight = window.innerHeight;
          
          // Recreate objects...
          // Similar logic would be applied here as above
          // For simplicity, we'll just reload the page on significant resize
          if (Math.abs(newContainerWidth - containerWidth) > 200 || 
              Math.abs(newContainerHeight - containerHeight) > 200) {
            window.location.reload();
          }
        }
      }, 300);
    };
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      container.innerHTML = '';
      window.removeEventListener('resize', handleResize);
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
