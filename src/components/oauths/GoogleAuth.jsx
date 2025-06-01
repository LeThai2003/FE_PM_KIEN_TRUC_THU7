import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from '../../firebase';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useNavigate } from 'react-router-dom';
import { signInFailed, signInStart, signInSuccess } from '../../redux/users/userSlice';
import { socket } from '../../utils/socket/socket';

const GoogleAuth = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleClickGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account"
      });

      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // console.log(result);

      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE, {
        fullname: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL
      });

      // console.log(response);

      if(response.data.user)
      {
        dispatch(signInSuccess(response.data.user));
        localStorage.setItem("token", response.data.accessToken);

        socket.emit("USER_LOGIN", {userId: response.data.user._id});
      }

      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      dispatch(signInFailed(error.response.data.message));
    }
  }

  return (
    <button onClick={handleClickGoogle} disabled={loading} className='flex gap-1 w-full px-4 py-2 text-[15px] cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg items-center justify-center text-gray-800 my-3'>
      <FcGoogle size={22}/>
      <span>Google</span>
    </button>
  )
}

export default GoogleAuth