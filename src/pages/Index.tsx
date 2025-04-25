import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import RegistrationForm from '@/components/RegistrationForm';
import DomainCards from '@/components/DomainCards';
import PrizePool from '@/components/PrizePool';
import Resources from '@/components/Resources';
import Timeline from '@/components/Timeline';
import Sponsors from '@/components/Sponsors';
import Footer from '@/components/Footer';
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Import Vanta effect
declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

const Index = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Set the body class to dark mode
    document.body.classList.add('dark');
    
    // Initialize Vanta effect
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x00e5ff,
        backgroundColor: 0x0d1117,
        points: 15.00,
        maxDistance: 25.00,
        spacing: 17.00,
        showDots: false
      }));
    }

    // Scroll to element if hash exists in URL
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };
    
    // Check hash on initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight
      );
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Line animation properties
    const lines: any[] = [];
    const maxLines = 50;
    const lineSpeed = 0.5;

    // Create initial lines
    for (let i = 0; i < maxLines; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * lineSpeed + 0.2,
      });
    }

    // Animation function
    function animate() {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
      ctx.lineWidth = 1;

      lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        const endX = line.x + Math.cos(line.angle) * line.length;
        const endY = line.y + Math.sin(line.angle) * line.length;
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Move line
        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;

        // Reset line if it goes off screen
        if (
          line.x < -line.length ||
          line.x > canvas.width + line.length ||
          line.y < -line.length ||
          line.y > canvas.height + line.length
        ) {
          line.x = Math.random() * canvas.width;
          line.y = Math.random() * canvas.height;
          line.angle = Math.random() * Math.PI * 2;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
      document.body.classList.remove('dark');
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [vantaEffect]);

  const handleRegisterClick = () => {
    setShowRegistrationForm(true);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-foreground overflow-x-hidden relative flex flex-col" ref={vantaRef}>
      {/* Global gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-[#B66EFF]/20 via-transparent to-[#00E5FF]/20 pointer-events-none" />
      
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      {/* Main content */}
      <div className="relative z-10 flex-1">
        <Header />
        <main>
          <section aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="sr-only">HackSprint 5.0 - A National Level Hackathon by PES College of Engineering</h1>
            <Hero onRegisterClick={handleRegisterClick} />
          </section>
          
          <section id="prizes" aria-labelledby="prize-heading">
            <h2 id="prize-heading" className="sr-only">Prize Pool and Awards</h2>
            <PrizePool />
          </section>
          
          <section id="domains" aria-labelledby="domain-heading">
            <h2 id="domain-heading" className="sr-only">Hackathon Domains</h2>
            <DomainCards />
          </section>
          
          <section id="resources" aria-labelledby="resource-heading">
            <h2 id="resource-heading" className="sr-only">Resources and Learning Materials</h2>
            <Resources />
          </section>
          
          <section id="timeline" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="sr-only">Event Timeline</h2>
            <Timeline />
          </section>
          
          <section id="sponsors" aria-labelledby="sponsor-heading">
            <h2 id="sponsor-heading" className="sr-only">Our Sponsors</h2>
            <Sponsors />
          </section>
        </main>
        
        <Footer />
      </div>

      {/* Registration form in dialog */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
        <DialogContent 
          className="max-w-2xl p-0 bg-transparent border-none"
          aria-describedby="registration-form-description"
        >
          <div id="registration-form-description" className="sr-only">
            Registration form for HackSprint 5.0 hackathon. Fill in your team details and submit your project proposal.
          </div>
          <RegistrationForm onClose={() => setShowRegistrationForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
