{/*HeroSection of the home page serves as the full-screen anding area for page, showcasing a bold, 
gradient-clipped headline (“Intelligent Insights for Modern Restaurants”)and a concise sub-tagline. 
It automatically checks your Google authentication status on load and presents a “Get Started” button 
that either triggers OAuth or, if you’re already signed in, takes you straight into the scraping dashboard—all 
styled responsively with Tailwind CSS. */}

import React, { useEffect, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const HeroSection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_BASE_URL;


  {/*Check auth status to handle Get Started button if the user is logged out show google login modal
    or directly send him to /scrap page */}
  useEffect(() => {
    checkAuth()
  }, [])

  {/*Calls backend api to check the auth status */}
  const checkAuth = async () => {
    setError(null)
    try {
      const { data } = await axios.get(`${API_URL}/auth/check-auth`, {
        withCredentials: true
      })
      if (data.authenticated) {
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (err) {
      setError(err);
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  {/*Google login method to create a JWT token at server side instead of using insecure methods like localstorage*/}
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (res) => {
      try {
        const { data } = await axios.post(
          `${API_URL}/auth/google_login`,
          { code: res.code },
          { withCredentials: true }
        )
        if (data.success) {
          setIsAuthenticated(true)
          setUser(data.user)
          navigate('/scraping')
        }
      } catch (err) {
        console.error('Login error', err)
        setError(err.response?.data?.error || 'Authentication failed')
      }
    },
    onError: (err) => {
      console.error('Google login failed', err)
      setError('Google login failed')
    }
  })

{/*On click of get Started button */}
  const handleGetStarted = () => {
    googleLogin()
  }


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" id = "home">
      <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
          <div className="mb-1">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Intelligent Insights for
            </span>
          </div>
          <div className="relative inline-block group">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Modern Restaurants
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-teal-400 transform scale-x-0 duration-700 ease-in-out group-hover:scale-x-100"></span>
          </div>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
          Web Scraping Restaurants info to grow your food business
        </p>

        <div className="mt-10 flex flex-col items-center space-y-4">
          {isAuthenticated ? (
            <Link to="/scraping">
              <button
                className="px-8 py-4 rounded-md bg-teal-500 hover:bg-teal-400 text-navy-900 font-medium text-lg
                           transition duration-300 transform hover:-translate-y-1 hover:shadow-xl
                           focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-navy-900"
              >
                Get Started
              </button>
            </Link>
          ) : (
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-md bg-teal-500 hover:bg-teal-400 text-navy-900 font-medium text-lg
                         transition duration-300 transform hover:-translate-y-1 hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-navy-900"
            >
              Get Started
            </button>
          )}

         
        </div>
      </div>
    </div>
  )
}

export default HeroSection
