{/*A dynamic navbar which checks the auth status of the user if the user is not authenticated
  it will show signup button else it would show logout button
  
  Also handles the scroll feature clicking on any link of the navbar would scroll to the relevant component d
  defined in App.jsx*/}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_BASE_URL;



{/* check auth status when component mounts */}
  useEffect(() => {
    checkAuth();
  }, []);

  {/*This function checks the authentication status of the component by calling the backend api*/}
  const checkAuth = async () => {
    setError(null);
    try {
      const { data } = await axios.get(
        `${API_URL}/auth/check-auth`,
        { withCredentials: true }
      );
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  {/*Google login api to create a JWT token at server side instead of using insecure methods as localstorage*/}
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (res) => {
      try {
        const { data } = await axios.post(
          `${API_URL}/auth/google_login`,
          { code: res.code },
          { withCredentials: true }
        );
        if (data.success) {
          setIsAuthenticated(true);
          setUser(data.user);
          navigate('/scraping');
        }
      } catch (err) {
        console.error('Login error', err);
        setError(err.response?.data?.error || 'Authentication failed');
      }
    },
    onError: (err) => {
      console.error('Google login failed', err);
      setError('Google login failed');
    }
  });


{/* same button is used for logout/login feature if loggedin dynamically change the button to logout*/}
  const handleAuthAction = () => {
    if (isAuthenticated) {
      axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
        toast.success("Logout Succesfully");
      })
      .catch((err) => {
        console.error('Logout failed', err);
        setError(err.response?.data?.error || 'Logout failed');
      });
    } else {
      googleLogin();
    }
  };

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu if it's open
      setIsOpen(false);
      
      // Smooth scroll to the element
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-navy-900 backdrop-blur-md border-b border-white/5`}>
      <Toaster/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                ScrapLab
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a
              onClick={() => scrollToSection('home')}
              className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Home
            </a>
            <a
              onClick={() => scrollToSection('features-section')}
              className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              About
            </a>
            <a
              onClick={() => scrollToSection('testimonials')}
              className="text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Testimonials
            </a>
            <button
              onClick={handleAuthAction}
              className="px-4 py-2 rounded-md bg-teal-500 hover:bg-teal-400 text-navy-900 font-medium text-sm transition duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              {isAuthenticated ? 'Logout' : 'Sign Up'}
            </button>
          </div>

          {/* Mobile Menu Button for responsiveness*/}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-navy-800 border-t border-white/5">
          <a
            onClick={() => scrollToSection('home')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-navy-700"
          >
            Home
          </a>
          <a
            onClick={() => scrollToSection('features-section')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-navy-700"
          >
            About
          </a>
          <a
            onClick={() => scrollToSection('testimonials')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-navy-700"
          >
            Testimonials
          </a>
          <button
            onClick={handleAuthAction}
            className="block w-full px-3 py-2 mt-4 rounded-md text-base font-medium bg-teal-500 hover:bg-teal-400 text-navy-900 text-center"
          >
            {isAuthenticated ? 'Logout' : 'Sign Up'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;