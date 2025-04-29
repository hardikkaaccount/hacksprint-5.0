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
import FloatingObjects from '@/components/FloatingObjects';

// Import Vanta effect
declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

const Index = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    // Set the body class to dark mode
    document.body.classList.add('dark');

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
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      document.body.classList.remove('dark');
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleRegisterClick = () => {
    setShowRegistrationForm(true);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-foreground overflow-x-hidden relative flex flex-col">
      {/* Global gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-[#B66EFF]/20 via-transparent to-[#00E5FF]/20 pointer-events-none" />
      {/* Floating tech-themed icons background */}
      <FloatingObjects />
      {/* Main content */}
      <div className="relative z-10 flex-1">
        <Header />
        <main>
          <section aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="sr-only">HackSprint 5.0 - A National Level Hackathon by P. E. S. College of Engineering</h1>
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
