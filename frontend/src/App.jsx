
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/Features';
import TestimonialsSection from './components/Testimonial';
import Footer from './components/Footer';
import './index.css';
import ScrapingPage from '../src/pages/Scraping'
import NotFound from './pages/NotFound';
import { Loader } from 'lucide-react';
import RestaurantDetailPage from './pages/RestaurantDetailsPage';
import ProtectedRoute from './components/ProtectRoute';

const API_URL = import.meta.env.VITE_BASE_URL;

const HomePage = () => {
  const location = useLocation();
  
  // Handle scrolling when navigating to homepage with a target section
  // When someone navigates here with { state: { scrollTo: 'testimonials' } },
  // we smooth-scroll to that element after mount
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure components are mounted
    }
  }, [location]);

  // Homepage components
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
};


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/scraping" 
        element={
          <ProtectedRoute>
            <ScrapingPage />
          </ProtectedRoute>
        } 
      />
      <Route
      path = "/restaurant/:id" element = {
      <ProtectedRoute>
      <RestaurantDetailPage/>
      </ProtectedRoute>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;