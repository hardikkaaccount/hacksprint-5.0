import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
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
  const elementsRef = useRef<Array<HTMLDivElement>>([]);
  const animationsRef = useRef<Array<Animation>>([]);
  
  const createElements = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Clear any existing objects
    container.innerHTML = '';
    elementsRef.current = [];
    animationsRef.current = [];
    
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
        elementsRef.current.push(element);
        
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
        
        // Use createRoot instead of ReactDOM.render (which is deprecated)
        const root = createRoot(iconContainer);
        root.render(
          <Icon 
            className={color} 
            size={size}
            style={{ width: '100%', height: '100%' }}
          />
        );
        
        // Add to container
        container.appendChild(element);
        
        // Apply animation - with more contained movement within its cell
        const movementRange = Math.min(cellWidth, cellHeight) * 0.3;
        const duration = randomFloat(16, 30); // Slightly faster animations
        const xMovement = randomFloat(-movementRange, movementRange);
        const yMovement = randomFloat(-movementRange, movementRange);
        const rotation = randomFloat(-120, 120);
        
        // Create keyframes animation
        const animation = element.animate(
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
        
        // Store animation reference
        animationsRef.current.push(animation);
        
        objectsCreated++;
      }
    }
  };
  
  useEffect(() => {
    createElements();
    
    // Periodically check if elements are still visible and recreate if needed
    const intervalId = setInterval(() => {
      if (containerRef.current) {
        const visibleElementCount = elementsRef.current.filter(
          el => el.isConnected && el.offsetParent !== null
        ).length;
        
        // If more than half the elements are missing, recreate all
        if (visibleElementCount < elementsRef.current.length / 2) {
          createElements();
        }
      }
    }, 60000); // Check every minute
    
    // Add resize handler to reposition objects when window size changes
    const handleResize = () => {
      // Clear and recreate the objects on resize
      createElements();
    };
    
    // Debounced resize listener
    let resizeTimer: NodeJS.Timeout | null = null;
    const debouncedResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 300);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      window.removeEventListener('resize', debouncedResize);
      clearInterval(intervalId);
      if (resizeTimer) clearTimeout(resizeTimer);
      
      // Stop all animations
      animationsRef.current.forEach(animation => {
        if (animation && animation.cancel) {
          animation.cancel();
        }
      });
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
