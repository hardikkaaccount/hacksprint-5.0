import React, { useEffect, useRef } from 'react';

const timelineEvents = [
  {
    emoji: '🟢',
    title: 'Registration Starts',
    date: '23 April',
    description: 'Registration opens for all participants'
  },
  {
    emoji: '🛑',
    title: 'Registration Ends',
    date: '05 May',
    description: 'Last date to register your team'
  },
  {
    emoji: '📣',
    title: 'Team Selection Announcement',
    date: '07 May',
    description: 'Selected teams will be announced'
  },
  {
    emoji: '💳',
    title: 'Payment (for selected teams)',
    date: '11 May',
    description: 'Selected teams complete their payment'
  },
  {
    emoji: '⚔️',
    title: 'Hackathon Day',
    date: '16 May',
    description: 'The main hackathon event begins!'
  },
  {
    emoji: '🏆',
    title: 'Prize Distribution',
    date: '17 May',
    description: 'Winners announced and prizes distributed'
  }
];

const Timeline = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      setTimeout(() => {
        titleRef.current!.style.opacity = '1';
        titleRef.current!.style.transform = 'translateY(0)';
      }, 100);
    }

    // Animate timeline line
    if (timelineRef.current) {
      setTimeout(() => {
        timelineRef.current!.style.height = '100%';
      }, 300);
    }

    // Animate events
    eventRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.style.opacity = '1';
          ref.style.transform = 'translateX(0)';
        }, 500 + (index * 200));
      }
    });
  }, []);

  return (
    <section className="py-16 relative" id="timeline">
      <div className="container mx-auto px-4">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#B66EFF] via-[#8A8FFF] to-[#00E5FF] text-transparent bg-clip-text opacity-0 transform -translate-y-10"
          style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
        >
          Hackathon Timeline
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Center Timeline line */}
          <div 
            ref={timelineRef}
            className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#B66EFF] via-[#8A8FFF] to-[#00E5FF]"
            style={{ height: '0%', transition: 'height 1.5s ease-out' }}
          />
          
          {/* Timeline events */}
          <div className="relative">
            {timelineEvents.map((event, index) => (
              <div
                key={event.title}
                ref={el => eventRefs.current[index] = el}
                className={`flex items-center mb-12 opacity-0 ${
                  index % 2 === 0 
                    ? 'md:flex-row flex-col transform -translate-x-10' 
                    : 'md:flex-row-reverse flex-col transform translate-x-10'
                }`}
                style={{ transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
              >
                {/* Content */}
                <div className={`md:w-5/12 w-full ${
                  index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                } text-left`}>
                  <div className="p-4 md:p-6 bg-muted/30 backdrop-blur rounded-xl border border-white/10 hover:border-[#00E5FF]/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-2 md:gap-4">
                      <h3 className={`text-lg md:text-xl font-bold group-hover:text-[#00E5FF] transition-colors ${
                        index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                      }`}>
                        {event.title}
                      </h3>
                      <span className={`text-xs md:text-sm font-medium bg-black/30 px-2 md:px-3 py-1 md:py-1.5 rounded-md text-white/80 whitespace-nowrap ${
                        index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                      }`}>
                        {event.date}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm md:text-base">{event.description}</p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="relative md:w-2/12 w-full flex justify-center my-4 md:my-0">
                  <div className="absolute w-10 h-10 md:w-12 md:h-12 bg-[#0D1117] rounded-full border-4 border-[#00E5FF] flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:border-[#B66EFF]">
                    <span className="text-xl md:text-2xl">{event.emoji}</span>
                  </div>
                </div>

                {/* Empty space for alternating layout (hidden on mobile) */}
                <div className="hidden md:block md:w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
