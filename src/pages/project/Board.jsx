import React, { useEffect, useState } from 'react'
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import { FaEllipsisVertical, FaPlus } from 'react-icons/fa6';
import moment from "moment";
import { LuMessageSquare } from 'react-icons/lu';
import Dropdown from '../../components/projects/Dropdown';
import { useParams } from 'react-router-dom';
import PriorityTag from '../../components/tasks/PriorityTag';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useDispatch, useSelector } from 'react-redux';
import { getNameInitials } from '../../utils/helper';
import {updateStatus} from "../../redux/tasks/taskSlice.js"


const ViewBoardProject = ({setIsModalNewTaskOpen, data}) => {

  const dataTasks = data;
  const dispatch = useDispatch();

  const moveTask = async (taskId, toStatus) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.TASK.UPDATE_STATUS, {taskId, toStatus});
      // console.log(response.data);
      dispatch(updateStatus(response.data.task));
      // getDataTasks();
    } catch (error) {
      console.log(error);
    }
  }

  const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];


  return (
    <DndProvider backend={HTML5Backend}>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4'>
        {taskStatus.map((status) => (
          <TaskColumn 
            key={status}
            status={status}
            tasks={dataTasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  )
}

export default ViewBoardProject


const TaskColumn = ({status, tasks, moveTask, setIsModalNewTaskOpen}) => {
  const [{isOver}, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  const tasksCount = tasks.filter((task) => task.status == status).length;

  const statusColor = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    "Completed": "#000000"
  }

  return(
    <div 
      ref={(instance) => {drop(instance)}}
      className={`py-4 px-2 rounded-lg  ${isOver ? "bg-blue-100 dark:text-neutral-900" : ""} `}
    >
      <div className='flex w-full mb-3'>
        <div className='w-2 rounded-l-lg' style={{background: statusColor[status]}}></div>
        <div className='flex items-center justify-between rounded-e-lg bg-white dark:bg-dark-secondary px-5 py-4 w-full'>
          <h3 className='flex items-center text-md font-semibold dark:text-white'>
            {status}{" "}
            <span
              className='ml-2 inline-block size-[1.5rem] rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary'
            >
              {tasksCount}
            </span>
          </h3>

          <div className='flex items-center'>
            <button className='flex items-center justify-center size-6 rounded hover:bg-gray-300 bg-gray-200 dark:bg-dark-tertiary dark:hover:bg-opacity-80 dark:text-white'
              onClick={() => {setIsModalNewTaskOpen(true)}}
            >
              <FaPlus size={16}/>
            </button>
          </div>
        </div>
      </div>
      {tasks.filter(task => task.status == status).map(task => (<Task key={task._id} task={task}/>))}
    </div>
  )
}


const Task = ({task}) => {

  const [{isDragging}, drag] = useDrag(() => ({
    type: "task",
    item: {id: task._id},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const {currentUser} = useSelector(state => state.users);

  // console.log(task);
  // console.log(currentUser);

  const taskTagsSplit =task.tags ? task.tags?.split(",") : [];

  const formattedStartDate = task.startDate ? moment(new Date(task.startDate)).format("DD/MM/yyyy"): "";
  const formattedDueDate = task.dueDate ? moment(new Date(task.dueDate)).format("DD/MM/yyyy"): "";

  const numberOfComments = task?.comments || 0;


  const [openDropdownTaskId, setOpenDropdownTaskId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-task')) {
        setOpenDropdownTaskId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return(
    <div 
      ref={(instance) => {drag(instance)}}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      {task?.imageTask && (
        <div className="h-[200px] overflow-hidden flex items-center justify-center">
          <img
            src={task.imageTask}
            alt="image task"
            className="object-fill h-auto w-full"
          />
        </div>
      )}

      <div className='p-4'>

        <div className='flex items-center justify-between'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
              {task.priority && <PriorityTag priority={task.priority}/>}
              <div className='flex gap-2'>
                {taskTagsSplit.map((tag) => (
                  <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium'>
                    {" "}{tag}
                  </div>
                ))}
              </div>
          </div>

          <div className='relative dropdown-task'>
            <button 
              className='flex size-6 items-center justify-center dark:text-neutral-300'
              onClick={() => setOpenDropdownTaskId(openDropdownTaskId == task._id ? null : task._id)}
            >
              <FaEllipsisVertical size={16}/>
            </button>

            {openDropdownTaskId == task._id && 
              <div className='absolute top-6 right-1'>
                <Dropdown userId={currentUser._id} data={task}/>
              </div>
            }
          </div>
        </div>
        
        <div className='my-2'>
          <h4 className='text-sm font-semibold dark:text-white'>{task.title}</h4>
        </div>

        <p className='font-medium text-xs text-gray-700 dark:text-neutral-400 line-clamp-3'>
          {task.description}
        </p>
        
        <div className='mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-neutral-400'>
          {formattedStartDate && <span className='font-medium'><strong>Start date:</strong> {formattedStartDate}</span>}
          {/* {formattedStartDate && formattedDueDate && <span> - </span>} */}
          {formattedDueDate && <span className='font-medium'><strong>Due date:</strong> {formattedDueDate}</span>}
        </div>

        <div className='mt-4 border-t border-gray-200 dark:border-stroke-dark'></div>

        <div className='flex items-center justify-between mt-3 '>
          <div className='flex -space-x-[7px] overflow-hidden'>
            {task.authorUserId?.profilePicture ? (
              <img
                src={task.authorUserId?.profilePicture}
                alt='image author'
                width={30}
                height={30}
                className='size-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary'
              />
            ) : (
              <div className='size-8 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                {getNameInitials(task.authorUserId?.fullname)}  
              </div>
            )}

            {task.assigneeUserId ? task.assigneeUserId?.profilePicture ? (
              <img
                src={task.assigneeUserId?.profilePicture}
                alt='image author'
                width={30}
                height={30}
                className='size-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary'
              />
            ) : (
              <div className='size-8 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                {getNameInitials(task.assigneeUserId?.fullname)}  
              </div>
            ) : null}
          </div>

          <div className='flex items-center justify-center text-gray-500 dark:text-neutral-500'>
            <LuMessageSquare className='-mb-[3px]' size={16}/>
            <span className='ml-1 text-sm dark:text-neutral-400'>{numberOfComments}</span>
          </div>

        </div>

      </div>

    </div>
  )

}