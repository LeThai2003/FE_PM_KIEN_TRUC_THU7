import React from 'react'
import { FaRegMessage } from "react-icons/fa6";
import { IoPersonAddOutline   } from "react-icons/io5";
import { RiTaskLine } from "react-icons/ri";
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const NotifyItem = ({notify, setIsNotificationOpen}) => {

  // console.log(notify);

  const timeFormat = moment(new Date(notify.createdAt)).format("DD/MM/yyyy HH:mm");

  const navigate = useNavigate();

  const handleClickNotify = async () => {
    if(notify.type == "comment")
    {
      navigate(`/task/${notify.taskId}`);
    }
    else
    {
      navigate(`/project/${notify.projectId}`);
    }
    setIsNotificationOpen(false);

    try {
      await axiosInstance.patch(API_PATHS.NOTIFICATION.UPDATE_SEEN(notify._id));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div onClick={handleClickNotify}>
      <div className={`w-full flex items-center justify-start gap-3 p-4  cursor-pointer ${notify.isSeen ? "hover:bg-gray-50 dark:hover:bg-gray-600" : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-600 dark:hover:bg-slate-700"}`}>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${notify.type== "comment" ? "bg-blue-50 text-blue-500" : notify.type == "member" ? "bg-green-50 text-green-500" : "bg-yellow-50 text-yellow-500"}  dark:bg-slate-700 dark:text-gray-200`}>
          {
            notify.type == "comment" 
            ? <FaRegMessage className='size-4'/> 
            : notify.type == "member" 
            ? <IoPersonAddOutline className='size-4'/>
            : <RiTaskLine className='size-4'/>
          }
        </div>
        <div className='w-[90%]'>
          <h3 className='text-sm font-medium dark:text-gray-100 dark:to-gray-200 line-clamp-2'>{notify.title}</h3>
          {/* <h3 className='text-sm font-medium dark:to-gray-200 whitespace-nowrap overflow-hidden text-ellipsis'>{title}</h3> */}
          <p className='text-gray-600 text-xs mt-1 dark:text-gray-400'>{timeFormat}</p>
        </div>
      </div>
      <div className='w-full h-[0.5px] dark:bg-gray-600  bg-gray-200'></div>
    </div>
  )
}

export default NotifyItem