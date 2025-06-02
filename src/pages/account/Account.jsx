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

const Account = () => {

  const navigate = useNavigate();

  const {currentUser} = useSelector(state => state.users);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState(null);

  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableEdit = () => {
    setIsDisable(false);
    setIsLoading(false);
    setError("");
  }

  const handleCancle = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setIsLoading(false);
    setIsDisable(true);
  }

  const isValid = () => {
    return oldPassword && newPassword && confirmNewPassword
  }

  const handleUpdate = async () => {

    setIsLoading(true);

    try {

      const response = await axiosInstance.patch(API_PATHS.USER.UPDATE_ACCOUNT(currentUser._id), {
        oldPassword, newPassword, confirmNewPassword
      });

      console.log(response.data);
      toast.success("Update password successfully");
      handleCancle();
      setIsDisable(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      toast.error(error.response.data.message)
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
        <h2 className='text-lg uppercase text-center font-medium dark:text-gray-200'>change password</h2>

        <Input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          id="Old password"
          label="Old password"
          isDisable={isDisable}
        />

        <Input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          id="New password"
          label="New password"
          isDisable={isDisable}
        />

        <Input
          type="password"
          placeholder="Comfirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          id="Confirm new password"
          label="Confirm new password"
          isDisable={isDisable}
        />

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

export default Account