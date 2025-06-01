import React, { useEffect, useState } from 'react'
import { data, Link, useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import GoogleAuth from '../../components/oauths/GoogleAuth';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import {useDispatch, useSelector} from "react-redux";
import { signInFailed, signInStart, signInSuccess } from '../../redux/users/userSlice';
import { isLogin } from '../../utils/isLogin';
import { socket } from '../../utils/socket/socket';

const Login = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.users);

  isLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!email)
    {
      setError("Please enter your email.");
      return;
    }

    if(!validateEmail(email))
    {
      setError("Please enter a valid email.");
      return;
    }

    if(!password)
    {
      setError("Please enter your password");
      return;
    }

    setError(null);

    // api ready
    try {

      dispatch(signInStart());

      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email, password
      });

      // console.log(response.data);
      if(response.data)
      {
        dispatch(signInSuccess(response.data.user));
        localStorage.setItem("token", response.data.accessToken);

        socket.emit("USER_LOGIN", {userId: response.data.user._id});
      }

      navigate("/")
    } catch (error) {
      console.log(error);
      dispatch(signInFailed(error.response.data.message));
      setError(error.response.data.message); 
    }
  }

  return (
    <div className='bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 w-full min-h-screen flex items-center justify-center'>
      <div className='bg-white flex flex-col w-[80%] sm:w-[70%] md:w-[60%] lg:w-[45%] xl:w-[38%] border-1 border-gray-200 rounded-lg px-8 py-8 shadow-xs'>
        <h3 className='text-2xl font-semibold text-gray-900 text-center tracking-[0.25px]'>Welcome Back</h3>

        <h3 className='text-sm font-medium text-gray-600 text-center mt-2 mb-1 tracking-[0.25px]'>Log in with</h3>
        <GoogleAuth/>

        <div className='relative text-center text-[#705cf5] mt-2 before-content-[""] before:absolute before:h-[0.75px] before:w-[44%] before:bg-gray-300 before:left-0 before:top-1/2 after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-[0.75px] after:w-[44%] after:bg-gray-300'>or</div>
        
        <p className='text-sm font-medium text-gray-600 text-center mt-2 mb-1 tracking-[0.25px]'>Please enter your details to log in</p>
        <form className='mt-3' onSubmit={handleLogin}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" id="email"/>
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Your password"} id="password"/>

          <Link to="/forgot-password" className='flex justify-end text-sm font-medium text-[#705cf5] hover:text-primary mt-3 pl-2 tracking-[0.25px]'>Forgot password?</Link>

          {error && <p className='text-sm text-red-500 mt-2 mb-4 pl-1'>{error}</p>}

          <button className='btn-primary' disabled={loading}>{loading ? "Loading..." : "login"}</button>
        </form>

        <p className='text-center mt-2 text-sm tracking-[0.25px]'>Don't have an account? <Link to="/signup" className='text-[#705cf5] font-medium cursor-pointer hover:underline'>Sign Up</Link></p>
        
      </div>
      
    </div>
  )
}

export default Login
