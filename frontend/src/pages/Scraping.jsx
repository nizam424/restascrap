{/*Scrapping page is responsible to call the backend flask api to start scraping and gets a json response from the api
  based on that json response the scrapping details are rendered in a card component
  Currently Scraping - "timeout.com/mumbai/restaurants/best-restaurants-in-mumbai"
  This page efficiently handles the scraping process by storing the scrap details in a localstorage even if the user navigates to
  different page and comebacks to this page instead of calling the api again we directly fetch it from the localstorage handling
  the process efficiently */}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { RefreshCw } from 'lucide-react';
function ScrapingPage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]); //store the restaurant detial
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null); // stores a timestamp of when the last data was fetched

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check localStorage first before calling the api
        const cachedData = localStorage.getItem('restaurantData');
        const cachedTimestamp = localStorage.getItem('restaurantDataTimestamp');
        
        // If we have cached data and it's less than 1 hour old, use it
        const ONE_HOUR = 60 * 60 * 1000; // in milliseconds
        const now = new Date().getTime();
        
        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp) < ONE_HOUR)) {
          const parsedData = JSON.parse(cachedData);
          setRestaurants(parsedData.restaurants);
          setLastFetchTime(new Date(parseInt(cachedTimestamp)).toLocaleTimeString());
          setLoading(false);
          console.log('Using cached restaurant data');
          return;
        }
        
        // If no valid cache exists, fetch from API
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/scrape`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        //handling error
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        //storing the fetched data in data var
        const data = await response.json();
        if (data.success) {
          // Update state
          setRestaurants(data.restaurants);
          
          // Save to localStorage with timestamp
          localStorage.setItem('restaurantData', JSON.stringify(data));
          const timestamp = new Date().getTime();
          localStorage.setItem('restaurantDataTimestamp', timestamp.toString());
          setLastFetchTime(new Date(timestamp).toLocaleTimeString());
        } else {
          setError(data.error || 'Failed to fetch restaurant data');
        }
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError(err.message || 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // To show the real time fetching feature i have added this refresh button 
  const handleRefresh = async () => {
    // Clear the cache and fetch fresh data
    localStorage.removeItem('restaurantData');
    localStorage.removeItem('restaurantDataTimestamp');
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/scrape`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setRestaurants(data.restaurants);
        
        // Save new data to localStorage
        localStorage.setItem('restaurantData', JSON.stringify(data));
        const timestamp = new Date().getTime();
        localStorage.setItem('restaurantDataTimestamp', timestamp.toString());
        setLastFetchTime(new Date(timestamp).toLocaleTimeString());
      } else {
        setError(data.error || 'Failed to fetch restaurant data');
      }
    } catch (err) {
      console.error('Error fetching restaurant data:', err);
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-navy-900 to-navy-700">
        <div className="w-12 h-12 border-4 border-navy-600 border-t-accent-teal rounded-full animate-spin mb-4"></div>
        <p className="text-white-300/80">Loading Mumbai's best restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center px-4">
        <Navbar/>
        <div className="text-center p-8 bg-navy-800 border border-navy-600 rounded-lg max-w-lg mx-auto shadow-lg">
          <h2 className="text-accent-teal text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-white-100 mb-6">{error}</p>
          <button 
            onClick={handleRefresh} 
            className="px-4 py-2 bg-accent-teal text-navy-900 font-medium rounded-md hover:bg-opacity-90 transform hover:-translate-y-1 transition duration-300 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-offset-2 focus:ring-offset-navy-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 text-white-100 py-12 px-4 mt-8 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent">
              Mumbai's Best Restaurants
            </span>
          </h1>
          <p className="text-lg text-white-300/80 max-w-2xl mx-auto">
            Discover the finest dining experiences in Mumbai
          </p>
          {lastFetchTime && (
            <div className="mt-2 text-sm text-white-300/60 flex items-center justify-center">
              <span>Last updated: {lastFetchTime}</span>
              <button 
                onClick={handleRefresh}
                className="ml-3 text-accent-teal hover:text-accent-teal/80 flex items-center gap-2"
                title="Refresh data"
              >
               <RefreshCw/>
                Refresh
              </button>
            </div>
          )}
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-navy-800 to-navy-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 border border-navy-600 hover:border-accent-teal group"
            >
              <div className="relative h-48 overflow-hidden">
                {restaurant.image ? (
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy-800 text-white-300/50 text-sm">
                  
                    No image available
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-black/80 px-3 py-1 rounded-full text-sm font-medium text-accent-gold">
                    {restaurant.price || 'Price not specified'}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-70"></div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold text-white-100 mb-3">{restaurant.title}</h2>
                <p className="text-white-300/80 text-sm line-clamp-4 flex-grow">
                  {restaurant.description || 'No description available for this restaurant.'}
                </p>
                <div className="mt-4 pt-4 border-t border-navy-600 flex justify-between items-center">
                  <div className="text-sm text-white-300/70">
                    Mumbai, India
                  </div>
                  <button 
                    onClick={() => navigate(`/restaurant/${restaurant.id || index}`, { state: { restaurant } })}
                    className="px-3 py-1 bg-navy-600 hover:bg-accent-teal hover:text-navy-900 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {restaurants.length === 0 && !loading && !error && (
          <div className="text-center p-10 bg-navy-800 rounded-lg shadow-lg border border-navy-600">
            <div className="text-accent-teal text-5xl mb-4">
            </div>
            <h3 className="text-xl font-semibold mb-2">No Restaurants Found</h3>
            <p className="text-white-300/80 mb-6">We couldn't find any restaurants at the moment. Please try again later.</p>
            <button 
              onClick={handleRefresh} 
              className="px-4 py-2 bg-accent-teal text-navy-900 font-medium rounded-md hover:bg-opacity-90 transition duration-300"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ScrapingPage;