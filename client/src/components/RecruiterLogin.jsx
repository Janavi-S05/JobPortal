import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecruiterLogin = () => {

  const navigate = useNavigate()
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const [image, setImage] = useState(false)
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    /* Stops the page from refreshing
    State is not lost only if you: 
    1. Store in localStorage / sessionStorage
    2. Use cookies or database
    3. Persist Redux state to browser storage
    These survive a reload because they are outside of RAM.
    */
    e.preventDefault()

    // When they click “Next” (form submitted) the below condition is checked
    if (state == 'Sign Up' && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true)
    }

    try {
      if (state === "Login") {
        console.log('backendUrl:', backendUrl);

        const { data } = await axios.post(backendUrl + 'api/company/login', { email, password })
        console.log(data)
        if (data.success) {
          console.log(data);
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        }
        else {
          toast.error(data.message)
        }
      }
      else {

        // Sends form data to /register endpoint (multipart/form-data)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('password', password)
        formData.append('email', email)
        formData.append('image', image)

        const { data } = await axios.post(backendUrl + 'api/company/register', formData)

        if (data.success) {
          console.log(data);
          
          // store the logged-in company’s profile information (like name, email, logo, etc.) in a shared global state
          // localStorage is not used in this case because react components do not automatically re-render when changed
          
          setCompanyData(data.company)
          setCompanyToken(data.token)
          
          /* Company data and token are stored in localStorage the user stays logged in even after refreshing the page.
          Token is saved in the browser’s localStorage
          Not stored in react state because it rests everytime the user reloads or closes the page, cannot acess outside React like axios interceptors whereas localStorage.getItem() is useful
          */
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        }
        else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    // disable page scrolling while the Recruiter login modal is open.
    document.body.style.overflow = 'hidden' // mounting when the recuriterLogin is set to true
    return () => {
      document.body.style.overflow = 'unset' // unmounting when the recuriterLogin is set to false
    }
  }, []) // Empty array means it runs once, only on mount/unmount


  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
        <p className='text-sm'>Welcome back , Please Sign in to continue</p>
        {
          state === 'Sign Up' && isTextDataSubmitted ?
            <>
              <div className='flex items-center gap-4 my-10'>
                <label htmlFor="image">
                  <img className="w-16 rounded-full" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                  <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
                <p>Upload Company <br /> logo </p>
              </div>
            </> :

            <>
              {state !== 'Login' && (<div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.person_icon} alt="" />
                <input className='outline-none text-sm'
                  onChange={e => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder='Company Name'
                  required
                />
              </div>)}


              <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon} alt="" />
                <input className='outline-none text-sm'
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder='Email Id'
                  required
                />
              </div>

              <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.lock_icon} alt="" />
                <input className='outline-none text-sm'
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder='Password'
                  required
                />
              </div>
            </>

        }

        {
          state === 'Login' && <p className="text-sm text-blue-600 mt-4 cursor-pointer">Forgot password?</p>
        }

        <button type='submit' className='bg-blue-600 w-full text-white mt-5 py-2 rounded-full mt-4'>
          {
            state === 'Login' ?
              'login' : isTextDataSubmitted ? 'create account' : 'next'
          }
        </button>

        {
          state === 'Login' ? <p className='mt-5 text-center'>Don't have an account? <span onClick={() => setState("Sign Up")} className='text-blue-600 cursor-pointer'>Sign Up</span></p>
            : <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Login")}>Login</span></p>
        }

        <img onClick={e => setShowRecruiterLogin(false)} className="absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="" />

      </form>
    </div>
  )
}

export default RecruiterLogin