import React, { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { IoIosArrowBack, IoMdArrowBack } from "react-icons/io";
import CoundownTime from '../../components/CoundownTime/CoundownTime';
import Input from '../../components/inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { isLogin } from '../../utils/isLogin';


const OtpPassword = () => {

  isLogin();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  }

  const onLoadAgain = async () => {
    try {

      setOtp("");

      const response = await axiosInstance.post(API_PATHS.AUTH.PASSWORD_FORGOT, {email});

      console.log(response.data);
     
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.response.data.message); 
    }
  }

  const handlePasswordOtp =async (e) => {
    e.preventDefault();

    if(!otp.trim())
    {
      setError("The OTP code not empty");
      return;
    }

    setError("");

    // API
    try {
      setIsLoading(true);

      const response = await axiosInstance.post(API_PATHS.AUTH.PASSWORD_OTP, {otp, email});

      if(response.data)
      {
        localStorage.setItem("token", response.data.resetPasswordToken);
        navigate("/reset-password");
      }

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

      <div className='w-full h-lvh flex justify-center items-center'>
        
        <div className='w-96 border border-gray-300 rounded-lg bg-white px-7 py-10'>
          <form onSubmit={handlePasswordOtp}>
            <h4 className='text-2xl mb-7'>Enter OTP Code</h4>

            {/* <input 
              type="number" 
              placeholder='OTP'
              className='input-box'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            /> */}

            <Input 
              type="number"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              id="opt"
              label="OTP code"
              isDisable={false}
            />

            {error && <p className='text-sm text-red-500 pl-1 mt-2'>{error}</p>}

            <button type='submit' className="btn-primary mt-2 mb-3" disabled={isLoading}>{isLoading ? "Loading..." : "Send"}</button>

            <CoundownTime onLoadAgain={onLoadAgain} time={300} />
          </form>
        </div>
      </div>

    </div>
  )
}

export default OtpPassword
