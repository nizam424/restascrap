import { useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Globe, MessageSquare, Share2 } from 'lucide-react';

const Footer = () => {
  const [emailHover, setEmailHover] = useState(false);
  
  // Quick links with their respective routes
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/' },
    { name: 'Testimonials', path: '/' },
  ];
  
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 border-t border-white/5 relative overflow-hidden">
      {/* Background patterns and accents */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6TTYgNHY2aDZ2LTZINnptMCAzMHY2aDZ2LTZINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5"></div>
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      <div className="absolute left-1/4 top-0 w-64 h-64 bg-gold-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      
      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-48">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">
                ScrapLab
              </span>
            </div>
            <p className="text-white/70 text-sm mt-2 max-w-xs">
              Powerful web scraping solutions for restaurants and businesses to gain competitive insights.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-white/60 hover:text-teal-400 transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-teal-400 transition-colors">
                <MessageSquare size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-teal-400 transition-colors">
                <Share2 size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500/50"></span>
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.path} className="text-white/70 hover:text-white text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 bg-teal-500/70 rounded-full mr-2 transition-all group-hover:w-2 group-hover:bg-teal-400"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500/50"></span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-teal-500 mt-1 flex-shrink-0" />
                <span className="text-white/70 text-sm">Goregaon West Mumbai</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-teal-500 flex-shrink-0" />
                <span className="text-white/70 text-sm">+12345678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-teal-500 flex-shrink-0" />
                <span 
                  className="text-white/70 text-sm"
                  onMouseEnter={() => setEmailHover(true)}
                  onMouseLeave={() => setEmailHover(false)}
                >
                  <span className={`transition-all duration-300 ${emailHover ? 'text-teal-400' : ''}`}>
                    moh.nizamuddin.khan@gmail.com
                  </span>
                </span>
              </li>
            </ul>
          </div>
          
         
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/50 text-sm">
              © {currentYear} ScrapLab. All rights reserved.
            </p>
            <p className="text-white/50 text-sm flex items-center">
              <span className="inline-flex items-center">
                Created by <span className="font-medium text-teal-400 ml-1">Nizamuddin Khan</span>
              </span>
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/50 hover:text-white/90 text-xs">Privacy Policy</a>
              <a href="#" className="text-white/50 hover:text-white/90 text-xs">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;