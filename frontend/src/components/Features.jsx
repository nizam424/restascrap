{/* gives a brief info about the food data after the hero section, only made to enhance the UI */}
import { useState, useEffect } from 'react';

const FeaturesSection = () => {
  // fade in effect for when the section comes into view
  const [isVisible, setIsVisible] = useState(false);

  // explained in detail in testimonial.jsx
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('features-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section
      id="features-section"
      className="py-16 md:py-24 bg-navy-800 relative overflow-hidden"
    >

      {/* Content container */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Left side - Text content */}
          <div className="w-full md:w-1/2 lg:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              <span className="bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                Unlock Restaurant Industry Insights
              </span>
            </h2>

            <div className="space-y-6 text-white/80">
              <p className="text-lg leading-relaxed">
                <strong className="text-teal-400">Curious about leveraging restaurant data?</strong> The food industry is evolving through strategic intelligence. Restaurant owners are now using competitor menu analysis to craft innovative offerings and exclusive promotions that help them stand out in a crowded market.
              </p>

              <p className="text-lg leading-relaxed">
                Understanding market pricing trends enables businesses to develop data-driven pricing strategies that balance competitiveness with profitability. With our specialized web scraping tools, you'll gain access to valuable insights that open up unlimited opportunities for growth and innovation.
              </p>

            </div>
          </div>

          {/* Right side - Image */}
          <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl shadow-navy-900/50 border border-white/5">
            <div className="aspect-video bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
              <div className="text-white/30 text-center p-3">
                <img
                  src="/image1.png"
                  alt="Restaurant data visualization"
                  className="w-full h-full object-cover"
                />
                <p className="text-sm">Image Source : actowizsolutions.com</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;