{/* 404 not found page - incase the user redirects to wrong url ,  instead of looking stuck/blank we handle it 
  effectively with 404 page to enhance user experience */}
import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
const NotFound = () => {
  return (
    <div>
        <Navbar/>

        <div className='min-h-screen flex flex-col justify-center items-center'>
            <h1>!!404!!</h1>
            <h3>The page you're looking for does not exists.</h3>
            <Link to = "/">
            <button>Go Back</button>
            </Link>
        </div>
    </div>
    
  )
}

export default NotFound