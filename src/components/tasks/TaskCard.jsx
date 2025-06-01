import moment from 'moment';
import React from 'react'
import PriorityTag from './PriorityTag';
import { StatusTag } from '../../pages/Task/TaskDetail';
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const TaskCard = ({task}) => {

  const navigate = useNavigate();

  const startDateFormat = task.startDate ? moment(new Date(task.startDate)).format("DD/MM/yyyy") : "Not set";
  const dueDateFormat = task.dueDate ? moment(new Date(task.dueDate)).format("DD/MM/yyyy") : "Not set";

  const taskTagsSplit =task.tags ? task.tags?.split(",") : [];

  return (
    <div className='group relative mt-3 bg-white dark:bg-slate-800 shadow-md dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-md px-3 pt-3 pb-3 tracking-[0.25px] flex flex-col gap-2'>
      <div className='absolute top-1 right-2 flex items-center justify-center gap-2'>
        <PriorityTag priority={task.priority}/>
        <StatusTag status={task.status}/>
      </div>
      
      <h3 className='mt-0 max-500:mt-5 text-sm font-medium dark:text-gray-200'>Title: <span className='font-normal'>{task.title}</span></h3>
      <p className='text-sm font-medium'>Description: <span className='font-normal'>{task.description}</span></p>
      <p className='text-sm font-medium'>Start date: <span className='font-normal text-green-700 dark:text-green-400'>{startDateFormat}</span></p>
      <p className='text-sm font-medium'>Due date: <span className='font-normal text-red-700 dark:text-yellow-400'>{dueDateFormat}</span></p>
      
      {taskTagsSplit.length > 0 && 
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium'>Tags: </p>
          <div className='flex gap-2'>
            {taskTagsSplit.map((tag) => (
              <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs dark:text-slate-900 font-medium'>
                {" "}{tag}
              </div>
            ))}
          </div>
        </div>
      }

      <div className='flex items-center justify-start'>
        <div className='flex items-center justify-start gap-2 mr-4'>
          <p className='text-sm font-medium'>Creator: </p>
          {
            task.authorUserId?.profilePicture ? 
              <div className='border border-gray-200 rounded-full'>
                <img
                  src={task.authorUserId.profilePicture}
                  alt='image assignee'
                  width={30}
                  height={30}
                  className='size-8 rounded-full object-cover dark:border-dark-secondary'
                />
              </div>
              :
              <div className='size-8 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                {getNameInitials(task.authorUserId.fullname)}  
              </div>
          }  
        </div>

        {
          task.assigneeUserId && 
          <div className='flex items-center justify-start gap-2'>
            <p className='text-sm font-medium'>Assignee: </p>
            {
              task.assigneeUserId.profilePicture ? 
                <div className='border border-gray-200 rounded-full'>
                  <img
                    src={task.assigneeUserId.profilePicture}
                    alt='image assignee'
                    width={30}
                    height={30}
                    className='size-8 rounded-full object-cover dark:border-dark-secondary'
                  />
                </div>
                :
                <div className='size-8 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                  {getNameInitials(task.assigneeUserId.fullname)}  
                </div>
            }  
          </div>
        }
      
      </div>

      <div 
        onClick={() => navigate(`/task/${task._id}`)}
        className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-2 flex items-center justify-center gap-2 px-3 py-1 rounded text-sm font-medium text-blue-600 dark:text-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200'
      >
        <FaRegEye className='-mb-[2px]'/>
        <p>Watch <span className='font-bold'></span></p>
      </div>

    </div>
  )
}

export default TaskCard