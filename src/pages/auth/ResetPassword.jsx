import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack, IoMdArrowBack } from "react-icons/io";
import Input from '../../components/inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { isLogin } from '../../utils/isLogin';

const ResetPassword = () => {

  isLogin();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const handleBack = () => {
    navigate(-1);
  }

  const handleOtpPassword = async (e) => {
    e.preventDefault();

    if(!newPassword)
    {
      setError("Please enter new password");
      return;
    }

    if(!confirmNewPassword)
    {
      setError("Please enter confirm new password");
      return;
    }

    if(newPassword != confirmNewPassword)
    {
      setError("Confirm password not compare");
      return;
    }

    setError("");

    const resetPasswordToken = localStorage.getItem("token");

    // fetch API
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.post(API_PATHS.AUTH.PASSWORD_RESET, {newPassword, resetPasswordToken});

      navigate("/login");

      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
          <form onSubmit={handleOtpPassword}>
            <h4 className='text-2xl mb-7'>Enter New Password</h4>

            <Input
              value={newPassword}
              id="newpassword"
              label="New Password"
              placeholder="Password"
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              isDisable={false}
            />

            <Input
              value={confirmNewPassword}
              id="confirm_newpassword"
              label="Confirm New Password"
              placeholder="Password"
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              isDisable={false}
            />

            {error && <p className='text-sm text-red-500 pl-1 mt-2'>{error}</p>}

            <button type='submit' className='btn-primary mt-4'>SEND</button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default ResetPassword
