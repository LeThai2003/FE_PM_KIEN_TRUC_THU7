import React, { useState } from 'react'
import { IoIosArrowBack, IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import Input from '../../components/inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { uploadSingleImage } from '../../utils/uploads/uploadImage';
import { useDispatch, useSelector } from 'react-redux';
import { isLogin } from '../../utils/isLogin';


const ForgotPassword = () => {

  isLogin();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if(!validateEmail(email))
    {
      setError("Please enter valid email.");
      return;
    }

    setError("");

    // fetch API
    try {
      
      setIsLoading(true);

      const response = await axiosInstance.post(API_PATHS.AUTH.PASSWORD_FORGOT, {email});

      navigate(`/otp-password?email=${email}`);

      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      setError(error.response.data.message); 
    }
  }

  return (
    <div className='relative bg-gradient-to-r from-sky-100 via-blue-200 to-emerald-100 w-full min-h-screen'>
      
      <div 
        onClick={() => navigate(-1)}
        className='absolute top-2 left-3 flex items-center justify-center gap-2 px-3 py-1 rounded text-sm font-medium text-blue-600 dark:text-white hover:bg-blue-50 dark:hover:bg-dark-tertiary cursor-pointer transition-all duration-200'
      >
        <IoIosArrowBack className='size-4'/>
        <p>Back</p>
      </div>

      <div className=' w-full h-lvh flex justify-center items-center'>
    
        <div className='w-96 border border-gray-300 rounded-lg bg-white px-7 py-10'>
          <form onSubmit={handleForgotPassword}>
            <h4 className='text-2xl mb-7'>Get OTP code</h4>

            {/* <input 
              type="email" 
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> */}

            <Input
              type="email" 
              placeholder='Email'
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              isDisable={false}
            />

            {error && <p className='text-sm text-red-500 mt-2 pl-1'>{error}</p>}

            <button type='submit' className='btn-primary mt-4' disabled={isLoading}>{isLoading ? "Loading..." : "Get OTP"}</button>

            <p className='text-center mt-2 text-sm'><i><b>Note: </b> The OTP code will be sent by your email!</i></p>
          </form>
        </div>

      </div>
    </div>
  )
}

export default ForgotPassword
