import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useDispatch } from 'react-redux';
import { updateTask } from '../../redux/tasks/taskSlice';

const ListSubTask = ({isJustView, status, taskId, listSubTasks, setStatusCurrent}) => {

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [listCheck, setListCheck] = useState(
    listSubTasks.length > 0 ? 
      listSubTasks?.filter(item => item.isChecked).map(item => item._id) 
      : 
      (status !== "To Do" && status !== "Work In Progress") ? ["completed"] : []
  );

  // console.log(status, listCheck);

  const handleChange = (e) => {
    if(e.target.checked)
    {
      // console.log(e.target.value);
      setListCheck([...listCheck, e.target.value]);
    }
    else
    {
      if(listCheck.includes(e.target.value))
      {
        setListCheck(listCheck.filter(id => id != e.target.value));
      }
    }
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
        const response = await axiosInstance.patch(API_PATHS.TASK.LIST_SUB_TASKS(taskId), {listCheck});
        // console.log(response);
        setStatusCurrent(response.data.task.status);
        dispatch(updateTask(response.data.task));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
  }

  // console.log(typeof isJustView, isJustView);

  return (
    <div className='px-1 pt-4 pb-2'>
      {listSubTasks?.length > 0 ? 
        <div className=''>
          <div name="tasksChecked">
            {listSubTasks?.map(item => (
              <div key={item._id} className="flex items-center mt-4">
                <input 
                  id={item._id} 
                  onChange={handleChange} 
                  type="checkbox" 
                  value={item._id} 
                  checked={listCheck.includes(item._id.toString())}
                  disabled={isJustView}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label 
                  htmlFor={item._id} 
                  className="ms-2 text-sm tracking-[0.2px] text-gray-700 dark:text-gray-300"
                >
                  {item.sub_title}
                </label>
              </div>
            ))}
          </div>

          {!isJustView && (
            <button
              className='mt-4 w-full px-4 py-2 cursor-pointer bg-violet-500 hover:bg-purple-600 uppercase rounded-lg flex items-center justify-center text-white font-medium my-3 dark:text-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700'
              onClick={handleUpdate}
            >
              {isLoading ? "UPDATING..." : "UPDATE TASK COMPLETE"}
            </button>
          )}
        </div> 
          : 
        <div>
          <p className='text-sm italic text-blue-500 dark:text-gray-200'>No list sub tasks</p>

          <div className="flex items-center mt-4" name="tasksChecked">
            <input 
              id="completed" 
              type="checkbox" 
              onChange={handleChange} 
              value="completed" 
              disabled={isJustView}
              checked={listCheck.includes("completed")}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label 
              htmlFor="completed" 
              className="ms-2 text-sm tracking-[0.2px] text-gray-700 dark:text-gray-300"
            >
              Compeleted Task
            </label>
          </div>

          {!isJustView && (
            <button
              className='mt-4 w-full px-4 py-2 cursor-pointer bg-violet-500 hover:bg-purple-600 uppercase rounded-lg flex items-center justify-center text-white font-medium my-3 dark:text-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700'
              onClick={handleUpdate}
            >
              {isLoading ? "UPDATING..." : "UPDATE TASK COMPLETE"}
            </button>
          )}
        </div>
      }
    </div>
  )
}

export default ListSubTask