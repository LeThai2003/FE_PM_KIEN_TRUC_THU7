import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import GoogleAuth from '../../components/oauths/GoogleAuth';
import PictureSelect from '../../components/inputs/PictureSelect';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import {LuUser} from "react-icons/lu";
import { uploadSingleImage } from '../../utils/uploads/uploadImage';
import { isLogin } from '../../utils/isLogin';

const Signup = () => {

  const navigate = useNavigate();

  isLogin();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if(!fullname)
    {
      setError("Please enter your fullname.");
      return;
    }

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

      setIsLoading(true);

      if(profilePic)
      {
        const uploadImageResult = await uploadSingleImage(profilePic);
        profileImageUrl = uploadImageResult.imageUrl || ""; 
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        fullname, email, password, profileImageUrl
      });

      navigate("/login")

      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      setError(error.response.data.message);
    }

  }

  return (
    <div className='bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 w-full min-h-screen flex items-center justify-center'>
      <div className='bg-white flex flex-col w-[80%] sm:w-[70%] md:w-[60%] lg:w-[52%] xl:w-[43%] border-1 border-gray-200 rounded-lg px-8 py-4 shadow-md'>
        <h3 className='text-2xl font-semibold text-gray-900 text-center tracking-[0.25px]'>Create an Account</h3>

        <h3 className='text-sm font-medium text-gray-600 text-center mt-2 mb-1 tracking-[0.25px]'>Sign up with</h3>
        <GoogleAuth/>

        <div className='relative text-center text-[#705cf5] mt-2 before-content-[""] before:absolute before:h-[0.75px] before:w-[44%] before:bg-gray-300 before:left-0 before:top-1/2 after:content-[""] after:absolute after:right-0 after:top-1/2 after:h-[0.75px] after:w-[44%] after:bg-gray-300'>or</div>
        
        <p className='text-sm font-medium text-gray-600 text-center mt-3 mb-1 tracking-[0.25px]'>Join us today by entering your details below</p>
        <form className='mt-1' onSubmit={handleSignUp}>

          <PictureSelect image={profilePic} setImage={setProfilePic} shape="c" iconFirst={LuUser}/>

          <Input label="Fullname" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Your fullname" id="fullname"/>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" id="email"/>
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Your password"} id="password"/>

          {error && <p className='text-sm text-red-500 mt-2 mb-4 pl-1'>{error}</p>}

          <button className='btn-primary' disabled={isLoading}>{isLoading ? "Loading..." : "Sign up"}</button>
        </form>

        <p className='text-center mt-2 text-sm tracking-[0.25px]'>Already have an account?{" "} <Link to="/login" className='text-[#705cf5] font-medium cursor-pointer hover:underline'>Log In</Link></p>
        
      </div>
      
    </div>
  )
}

export default Signup