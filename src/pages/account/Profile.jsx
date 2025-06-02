import React, { useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io';
import HomeLayout from '../../components/Layouts/HomeLayout';
import PictureSelect from '../../components/inputs/PictureSelect';
import {LuUser} from "react-icons/lu";
import Input from '../../components/inputs/Input';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { signInSuccess } from '../../redux/users/userSlice';
import {uploadSingleImage} from "../../utils/uploads/uploadImage"
import { validateEmail } from '../../utils/helper';
import toast from 'react-hot-toast';

const Profile = () => {

  const navigate = useNavigate();

  const {currentUser} = useSelector(state => state.users);
  const dispatch = useDispatch();

  const [profilePic, setProfilePic] = useState(currentUser?.profilePicture || null);
  const [fullname, setFullname] = useState(currentUser?.fullname || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [major, setMajor] = useState(currentUser?.major || "");
  const [description, setDescription] = useState(currentUser?.description || "");

  const [error, setError] = useState(null);

  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableEdit = () => {
    setIsDisable(false);
    setIsLoading(false);
    setError("");
  }

  const handleCancle = () => {
    setProfilePic(currentUser?.profilePicture || null);
    setFullname(currentUser?.fullname || "");
    setEmail(currentUser?.email || "");
    setMajor(currentUser?.major || "");
    setDescription(currentUser?.description || "");
    setError("");
    setIsLoading(false);
    setIsDisable(true);
  }

  const isValid = () => {
    return fullname && email
  }

  const handleUpdate = async () => {

    if(!validateEmail(email))
    {
      setError("Please enter a valid email.");
      setIsLoading(false);
      return;
    }

    setError("");

    setIsDisable(true);
    setIsLoading(true);

    let profileImageUrl = "";

    try {

      if(profilePic)
      {
        const uploadImageResult = await uploadSingleImage(profilePic);
        profileImageUrl = uploadImageResult.imageUrl || ""; 
      }

      const response = await axiosInstance.patch(API_PATHS.USER.UPDATE_PROFILE(currentUser._id), {
        fullname, email, profilePicture: profileImageUrl, major, description
      });

      dispatch(signInSuccess(response.data.user));

      toast.success("Update profile successfully");

      console.log(response.data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Update profile fail");
      setIsLoading(false);
    }
  }

  return (
    <HomeLayout>
      <div className='relative'>
        <div 
          onClick={() => navigate(`/`)}
          className='absolute top-0 left-1 flex items-center justify-center gap-2 px-3 py-1 rounded text-sm font-medium text-blue-600 dark:text-white hover:bg-blue-50 dark:hover:bg-dark-tertiary cursor-pointer transition-all duration-200'
        >
          <IoIosArrowBack className='size-4 -mb-[1px]'/>
          <p>Back To Home</p>
        </div>
      </div>
      <div className='lg:max-w-2xl md:max-w-lg sm:max-w-md max-w-sm mt-10 mx-auto shadow-lg bg-white dark:bg-dark-secondary border border-gray-200 dark:border-gray-600 rounded-lg flex flex-col px-3 py-2'>
        <h2 className='text-lg uppercase text-center font-medium dark:text-gray-200'>profile information</h2>

        <div className='mt-3'>
          <PictureSelect image={profilePic} setImage={setProfilePic} shape="c" iconFirst={LuUser} isDisable={isDisable}/>
        </div>

        <Input
          type="text"
          placeholder="Fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          id="fullname"
          label="Fullname"
          isDisable={isDisable}
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email"
          isDisable={isDisable}
        />

        <Input
          type="text"
          placeholder="Software engineer, UI/UX, ..."
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          id="major"
          label="Major"
          isDisable={isDisable}
        />

        <div className='mt-3 flex flex-col'>
          <label htmlFor='description' className='text-slate-800 text-[14px] pl-1 font-medium dark:text-white'>Description</label>
          <textarea
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id='description'
            disabled={isDisable}
            className='w-full px-4 pt-3 outline-none rounded-lg text-gray-900 text-sm mt-1 border dark:bg-dark-tertiary dark:text-white border-gray-100 dark:border-gray-600 overflow-y-auto custom-scrollbar'
          />
        </div>

        {error && <p className='text-sm text-red-500 mt-2 mb-4 pl-1'>{error}</p>}

        {isDisable ? 
          <button
            className='btn-primary'
            onClick={handleEnableEdit}
          >
            EDIT
          </button>
          :
          <div>
            <button
              className='w-full px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 uppercase rounded-lg flex items-center justify-center text-white font-medium my-3'
              onClick={handleCancle}
            >
              CANCLE
            </button>

            <button
              disabled={!isValid() || isLoading}
              className={`w-full px-4 py-2 bg-violet-500 ${!isValid() || isLoading ? "cursor-not-allowed" : "hover:bg-purple-600 cursor-pointer"} uppercase rounded-lg flex items-center justify-center text-white font-medium my-3`}
              onClick={handleUpdate}
            >
              UPDATE
            </button>

          </div>
        }

      </div>
    </HomeLayout>
  )
}

export default Profile