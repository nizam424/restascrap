{/*When you click on view details button on the /scrap page complete detail of the restaurant is shown
  instead of again calling the server for the details we handle this efficiently by passing the detail of the previous
  page to this page*/}

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const RestaurantDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state?.restaurant;

  const handleGoBack = () => {
    navigate('/scraping');
  };

  // If no restaurant data was passed, show an error message
  if (!restaurant) {
    return (
      <>
      <Navbar/>
      
      <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 text-white flex items-center justify-center p-4">
        <div className="text-center p-8 bg-navy-800 border border-navy-600 rounded-lg max-w-lg shadow-lg">
          <h2 className="text-accent-teal text-xl font-bold mb-4">
            Restaurant Not Found
          </h2>
          <p className="text-white/80 mb-6">
            We couldn't find the restaurant details. Please go back and try again.
          </p>
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center px-4 py-2 bg-accent-teal text-navy-900 font-medium rounded-md hover:bg-opacity-90 transition duration-300"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Restaurants
          </button>
        </div>
      </div>
      </>
    );
  }

  return (
    <div>
    <Navbar/>
    
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 text-white py-12 px-4 mt-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 rounded-md text-white transition-colors duration-300 border border-navy-600 hover:border-accent-teal"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Restaurants
        </button>

        <div className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-lg overflow-hidden shadow-lg border border-navy-600">
          <div className="md:flex">
            {/* Left side - Image */}
            <div className="md:w-1/2 relative">
              {restaurant.image ? (
                <div className="relative h-full">
                  <img
                    src={restaurant.image}
                    alt={restaurant.title}
                    className="w-full h-full object-cover md:min-h-[500px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-900/30 pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-full h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-navy-800 text-white/50">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mb-4 text-navy-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>No image available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Restaurant Details */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{restaurant.title}</h1>
                <div className="flex items-center bg-navy-600/50 px-3 py-1 rounded-full">
                  <span className="text-accent-gold font-medium">
                    {restaurant.price || 'Price not specified'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-accent-teal mb-2">
                  Description
                </h2>
                <p className="text-white/80 whitespace-pre-line">
                  {restaurant.description || 'No description available for this restaurant.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RestaurantDetailPage;
