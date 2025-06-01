import React from 'react'
import NotifyItem from './NotifyItem'
import { useState } from 'react'
import { useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { socket } from '../../utils/socket/socket';
import { useSelector } from 'react-redux';
import { Badge } from 'antd';
import { useRef } from 'react';
import { GoBell } from "react-icons/go";

const Notification = ({}) => {

  const {currentUser} = useSelector(state => state.users);

  const [data, setData] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [countNotificationNotSeen, setCountNotificationNotSeen] = useState(0);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.NOTIFICATION.GET_ALL);
        setData(response.data.notifications);

        let totalNotSeen = 0;
        response.data.notifications?.forEach(item => {
          if(!item.isSeen)
          {
            totalNotSeen += 1;
          }
        });
        if(totalNotSeen)
        {
          setCountNotificationNotSeen(totalNotSeen);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getNotifications();
  }, []);

  useEffect(() => {
    socket.on("NOTIFICATION", (data) => {
      if(data.notification.userId == currentUser._id)
      {
        setData(prev => [{...data.notification}, ...prev]);
        setCountNotificationNotSeen(prev => prev + 1);
      }
    });

    socket.on("MEMBER_ACCEPT_JOIN_PROJECT", (data) => {
      // console.log("---------memeber----------", data);
      if(data.notification.userId == currentUser._id)
      {
        setData(prev => [{...data.notification}, ...prev]);
        setCountNotificationNotSeen(prev => prev + 1);
      }
    });

    socket.on("NOTIFY_CREATE_NEW_TASK", (data) => {
      console.log("---------NOTIFY_CREATE_NEW_TASK----------", data);
      if(data.notification.userId == currentUser._id)
      {
        setData(prev => [{...data.notification}, ...prev]);
        setCountNotificationNotSeen(prev => prev + 1);
      }
    });  

    socket.on("NOTIFY_SERVER_DELETE_COMMENT", (data) => {
      // console.log("-------------------delete notification ---------------------")
      if(data.userId == currentUser._id)
      {
        setData(prev => prev.filter(item => item.commentId != data.commentId));
      }
    });

    socket.on("NOTIFY_SERVER_DELETE_TASK", (data) => {
      // console.log("-------------------delete notification ---------------------")
      if(data.userId == currentUser._id)
      {
        setData(prev => prev.filter(item => item.taskId != data.taskId));
        
      }
    });

    return() => {
      socket.off("NOTIFICATION");
      socket.off("MEMBER_ACCEPT_JOIN_PROJECT");
      socket.off("SERVER_DELETE_NOTIFICATION");
      socket.off("NOTIFY_SERVER_DELETE_TASK");
      socket.off("NOTIFY_CREATE_NEW_TASK");
    }
  }, []);

  const clickOpenNotifyBox = async () => {
    setIsNotificationOpen(!isNotificationOpen);
    setCountNotificationNotSeen(0);
  }

  // console.log(data);

  return (
    <div className='relative' ref={dropdownRef}>
      <button 
        className='btn-icon' 
        onClick={clickOpenNotifyBox}
      >
        <Badge count={countNotificationNotSeen} showZero={false}>
          <GoBell className='cursor-pointer size-5 dark:text-gray-200'/>
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

        <div className='overflow-y-auto custom-scrollbar h-[290px]'>
          {data.length > 0 ? (
            <>
              {data.map(item => <NotifyItem key={item._id} notify={item} setIsNotificationOpen={setIsNotificationOpen}/>)}
            </>
          ) : (
            <div className='flex items-center m-5 text-red-500 dark:text-slate-400'>No notification to show...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notification