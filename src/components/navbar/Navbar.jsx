import React, { useEffect, useRef, useState } from 'react'
import { IoMenu, IoSearchOutline, IoMoonOutline, IoSettingsOutline, IoSunnyOutline, IoPersonAddOutline   } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { setIsDarkMode, setIsSiderMenuCollapsed } from '../../redux/globals';
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineLock } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { getNameInitials } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Notification from './Notification';
import { socket } from '../../utils/socket/socket';
import { addProject, updateMember } from '../../redux/projects/projectSlice';


const Navbar = () => {

  const dispatch = useDispatch();
  const {isDarkMode} = useSelector(state => state.globals);
  const {isSiderMenuCollapsed} = useSelector(state => state.globals);

  const {currentUser} = useSelector(state => state.users);

  // console.log(currentUser);

  const navigate = useNavigate();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOpenDropdownAvatar, setIsOpenDropdownAvatar] = useState(false);

  // console.log(isDarkMode);

  const dropdownRef = useRef(null);
  const avatarDropdown = useRef(null);

  //Xử lý click bên ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  //Xử lý click bên ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarDropdown.current && !avatarDropdown.current.contains(event.target)) {
        setIsOpenDropdownAvatar(false);
      }
    };

    if (isOpenDropdownAvatar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenDropdownAvatar]);


  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      
    } catch (error) {
      console.log(error);
    }
    localStorage.clear();
    navigate("/login");
  }

  // socket add member
  useEffect(() => {
    socket.on("ADD_MEMBER_TO_PROJECT", (data) => {  
      // console.log(currentUser._id, " ---- ", data.member._id);
      if(currentUser._id == data.member._id)  // nguoi duoc them
      {
        // console.log("-------add member: ------------", data);
        dispatch(addProject(data.project));
        dispatch(updateMember(data));
      }
      if(currentUser._id == data.project.authorUserId._id)  // nguoi them vao du an
      {
        // console.log("Author update memeber");
        dispatch(updateMember(data));
      }
    })

    return () => {
      socket.off("ADD_MEMBER_TO_PROJECT");
    }
  }, []);
  // socket add member

  return (
    <div className='flex sticky top-0 z-10 justify-between px-4 py-3 bg-white border-b-[1.5px] border-gray-200 dark:bg-dark-bg dark:border-b dark:border-gray-700'>
      <div className='flex items-center'>
        
        {isSiderMenuCollapsed ?
          <button className='btn-icon' onClick={() => dispatch(setIsSiderMenuCollapsed(false))}>
            <IoIosMenu />
          </button>
          : 
          null
        }
        <button onClick={() => navigate("/search")} className='btn-icon'> 
          <IoSearchOutline />
        </button>
      </div>
      <div className='flex items-center'>
        <button className='btn-icon' onClick={() => dispatch(setIsDarkMode(!isDarkMode))}>
          {isDarkMode ? 
            <IoSunnyOutline className='cursor-pointer' /> 
            : 
            <IoMoonOutline className='cursor-pointer'/>
          }
        </button>
        
        <button onClick={() => navigate("/#")} className='btn-icon'> 
          <IoSettingsOutline className='cursor-pointer'/>
        </button>

        <div className='w-[0.1rem] min-h-[2em] bg-gray-200 ml-2 mr-2'></div>

        {/* <div className='relative' ref={dropdownRef}>
          <button 
            className='btn-icon' 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Badge count={1} showZero={false}>
              <GoBell className='cursor-pointer size-5'/>
            </Badge>
          </button>

          <div className={`absolute top-10 right-0 bg-white dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600 w-[370px] h-[375px] rounded border border-gray-100 z-10 shadow-xl transition-all duration-200 ease-out ${isNotificationOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            
            <div className='w-full flex items-center justify-between px-4 py-5'>
              <div className='flex items-center justify-center gap-2'>
                <GoBell className='cursor-pointer size-4 -mb-[2px]'/>
                <h4 className='text-sm font-medium dark:text-gray-200'>Notifications</h4>
              </div>
              <button className='text-blue-500 text-xs px-5 py-2 rounded hover:bg-blue-50 transition-all duration-200 dark:text-gray-200 dark:hover:bg-slate-700'>
                View All
              </button>
            </div>

            <div className='w-full h-[0.5px] dark:bg-gray-600 bg-gray-200'></div>

            <Notification/>

          </div>
        </div> */}

        <Notification/>
        
        <div ref={avatarDropdown} className='relative'>
          {
            currentUser?.profilePicture ?
            <div 
              className='size-10 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800 ml-2 cursor-pointer'
              onClick={() => setIsOpenDropdownAvatar(!isOpenDropdownAvatar)}  
            >
              <img 
                src={currentUser.profilePicture}
                alt="image profile" 
                className='size-10 object-cover'  
              />
            </div>
            :
            <div 
              className='size-10 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200 ml-2 cursor-pointer'
              onClick={() => setIsOpenDropdownAvatar(!isOpenDropdownAvatar)}  
            >
              {getNameInitials(currentUser?.fullname)}  
            </div>

          }

          <div className={`absolute top-10 bg-white right-0 dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600 w-[265px] h-fit rounded border border-gray-100 z-10 shadow-2xl transition-all duration-200 ease-out ${isOpenDropdownAvatar ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className='flex justify-start items-center py-4 px-4 gap-3'>
              {
                currentUser?.profilePicture ?
                <div 
                  className='size-11 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800 ml-2 cursor-pointer'
                  onClick={() => setIsOpenDropdownAvatar(!isOpenDropdownAvatar)}  
                >
                  <img 
                    src={currentUser.profilePicture}
                    alt="image profile" 
                    className='size-11 object-cover'  
                  />
                </div>
                :
                <div 
                  className='size-11 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200 ml-2 cursor-pointer'
                  onClick={() => setIsOpenDropdownAvatar(!isOpenDropdownAvatar)}  
                >
                  {getNameInitials(currentUser?.fullname)}  
                </div>
              }
              <div className='flex flex-col'>
                <h3 className='text-sm font-medium text-gray-800 dark:text-gray-200'>{currentUser?.fullname}</h3>
                {currentUser?.major && <p className='mt-1 text-slate-400 text-sm dark:text-gray-300 tracking-[0.15px]'>{currentUser.major}</p>}
              </div>
            </div>

            <div className='border-b border-gray-100 dark:border-gray-600'></div>

            <div className='text-sm py-2'>
              <div 
                className='cursor-pointer px-4 py-3 flex justify-start items-center gap-3 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-800'
                onClick={() => navigate(`/profile/${currentUser._id}`)}
              >
                <FaRegUser className='size-4'/>
                <p className=''>Edit Profile</p>
              </div>
              <div 
                className='cursor-pointer px-4 py-3 flex justify-start items-center gap-3 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-800'
                onClick={() => navigate(`/account/${currentUser._id}`)}
              >
                <MdOutlineLock className='size-4'/>
                <p className=''>Account Setting</p>
              </div>
              <div onClick={handleLogout} className='cursor-pointer px-4 py-3 flex justify-start items-center gap-3 hover:bg-red-50 text-red-600 dark:text-slate-400 dark:hover:text-slate-200 dark:font-bold dark:hover:bg-slate-900'>
                <AiOutlineLogout className='size-4'/>
                <p className=''>Logout</p>
              </div>
            

            </div>
          </div>
        </div>



      </div>
    </div>
  )
}

export default Navbar