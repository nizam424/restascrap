{/*A carousel based testimonial of dummy data , on smaller screen it shows 3 cards whereas on the 
  larger screen you can see based on the carousel you set */}
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [showSecondSet, setShowSecondSet] = useState(false); //toggles between the first 3 and next 3
  const [isVisible, setIsVisible] = useState(false); // trigger fade in
  const testimonialsRef = useRef(null); // to watch whether the user has reached on the testimonial section

  // Fade-in when section scrolls into view
  // checks if 20% of the testimonial section is visible to the user using IntersectionObserver if yes then calls 
  // the set visible to start the fade in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    return () => observer.disconnect();
  }, []);

  //testimonials dummy data
  const testimonials = [
    { id: 1, name: 'John Doe', role: 'Restaurant Owner', text: 'ScrapLab has revolutionized our menu planning and helped us stand out in our neighborhood.' },
    { id: 2, name: 'Jane Doe', role: 'Restaurant Consultant', text: "This is the best tool for restaurant data. The pricing insights alone are worth it." },
    { id: 3, name: 'Michael Rodriguez', role: 'Food Chain Manager', text: "We increased profit margins by 15% after using ScrapLab's pricing data." },
    { id: 4, name: 'Jessica Lee', role: 'Marketing Director', text: 'The depth of insights helped us identify market gaps and craft targeted promotions.' }
  ];

  // For small/medium screens,only  show the first 3 testimonials
  // For large screens, show based on the carousel state which can be changed with arrows
  const displayed = window.innerWidth < 1024 
    ? testimonials.slice(0, 3) 
    : (showSecondSet ? testimonials.slice(1, 4) : testimonials.slice(0, 3));

  return (
    <section
      ref={testimonialsRef}
      id="testimonials"
      className="py-20 bg-navy-900"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
            What Our Clients Say
          </span>
        </h2>
        <p className="text-lg text-white/70">
          See how businesses are transforming with our restaurant data solutions
        </p>
      </div>

      {/* Desktop: Carousel with arrows */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center">
        {/* Prev Button */}
        <button
          onClick={() => setShowSecondSet(false)}
          disabled={!showSecondSet}
          className="p-2 rounded-full bg-navy-800 text-white hover:bg-navy-700 focus:outline-none disabled:opacity-50"
          aria-label="Previous testimonials"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Testimonials Grid */}
        <div className={`flex-1 mx-6 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>          
          <div className="grid grid-cols-3 gap-6">
            {displayed.map((t) => (
              <div
                key={t.id}
                className="bg-navy-800 border border-white/10 rounded-lg p-6 flex flex-col"
              >
                <p className="text-white/80 italic flex-grow">"{t.text}"</p>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-500/30 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{t.name}</p>
                    <p className="text-white/60 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => setShowSecondSet(true)}
          disabled={showSecondSet}
          className="p-2 rounded-full bg-navy-800 text-white hover:bg-navy-700 focus:outline-none disabled:opacity-50"
          aria-label="Next testimonials"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Responsive - Mobile & Tablet: Simple grid without arrows */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="bg-navy-800 border border-white/10 rounded-lg p-6 flex flex-col"
              >
                <p className="text-white/80 italic flex-grow">"{t.text}"</p>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-500/30 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{t.name}</p>
                    <p className="text-white/60 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;