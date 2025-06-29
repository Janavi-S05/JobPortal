import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  
  // openSignIn is a function that opens the sign-in UI/modal provided by Clerk.
  const { openSignIn } = useClerk()
  const { user } = useUser() 

  /* Extract the user object from the useUser() hook provided by clerk(Auth library for react)
  When you call useUser(), it returns an object that typically looks like:
  {
    isSignedIn: true,
    user: {
      id: "...",
      firstName: "...",
      lastName: "...",
      emailAddresses: [...],
      // more user info
    },
    isLoaded: true
  }
  const { user } = useUser();:
  You're extracting the user property from that returned object.*/

  const navigate = useNavigate()

  const { setShowRecruiterLogin } = useContext(AppContext)
  return (
    <div className='shadow py-2'>
      <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>

        <img onClick={()=>navigate('/')} className='cursor-pointer ml-15 w-14 h-14 sm:w-16 sm:h-16 md:w-15 md:h-15 rounded-full object-cover' src={assets.logo} alt="" />

        {/* <img onClick={() => navigate('/')} className='cursor-pointer' src={assets.logo} alt="" /> */}

        {
          user ?
            // If user is logged in, show this:
            <div className='flex items-center gap-3'>
              <Link to={'/applications'}>Applied Jobs</Link>
              <p>|</p>
              <p className='max-sm:hidden'>Hi, {user.firstName + " " + user.lastName}</p>
              {/* // Clerk's user button e.g., avatar with dropdown */}
              <UserButton /> 
            </div>
            :
            // If user is NOT logged in, show this:
            <div className='flex gap-4 max-sm:text-xs'>
              <button onClick={e => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
{/* 
              <button onClick={e => openSignIn()} className='bg-teal-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
 */}
              {/* Clerk's sign-in modal  */}
              <button onClick={e => openSignIn()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>
        }

      </div>
    </div>
  )
}

export default Navbar