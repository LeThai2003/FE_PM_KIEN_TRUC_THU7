import React, { useState } from 'react'
import Modal from '../Modal';
import Input from '../inputs/Input';
import InputSubTask from '../inputs/InputSubTask';
import PictureSelect from '../inputs/PictureSelect';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../../redux/tasks/taskSlice';
import { CiImageOn } from "react-icons/ci";
import { uploadSingleImage } from '../../utils/uploads/uploadImage';
import toast from 'react-hot-toast';


const ModalNewTask = ({isOpen, onClose, type, data, projectId}) => {

  const dispatch = useDispatch();
  const {projects} = useSelector(state => state.projects);
  const {currentUser} = useSelector(state => state.users);

  // console.log(projects);

  const project = projects?.find(project => project._id == projectId);

  let members = [];
  let membersUpdate = [];

  if(project)
  {
    if(type == "create")   // new --> ignore yourself
    {
      members.push(project.authorUserId);
      if(project.membersId) members.push(...project.membersId);
      members = members.filter(m => m._id !== currentUser._id);
    }
    else  // update --> ignore author task
    {
      membersUpdate.push(project.authorUserId);
      if(project.membersId) membersUpdate.push(...project.membersId);
      membersUpdate = membersUpdate.filter(m => m._id !== data.authorUserId._id);
    }
  }

  let [title, setTitle] = useState(data?.title || "");
  let [description, setDescription] = useState(data?.description || "");
  let [status, setStatus] = useState(data?.status || "");
  let [priority, setPriority] = useState(data?.priority || "");
  let [tags, setTags] = useState(data?.tags || "");
  let [startDate, setStartDate] = useState(data?.startDate?.split("T")[0] || "");
  let [dueDate, setDueDate] = useState(data?.dueDate?.split("T")[0] || "");
  let [assigneeUserId, setAssigneeUserId] = useState(data?.assigneeUserId?._id || "");
  let [listSubTask, setListSubTask] = useState(data?.sub_tasks || []);
  let [isLoading, setIsLoading] = useState(false);
  let [profilePic, setProfilePic] = useState(data?.imageTask || null);


  const isFormValid = () => {
    return title
  }

  const selectStyles = "block w-full rounded border border-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";


  const handleFormKeyDown = (e) => {
    if(e.key == "Enter")
    {
      e.preventDefault();
    }
  }

  const closeModalNewAndEditTask =  () => {
    onClose();
    setTitle("");
    setDescription("");
    setStatus("");
    setPriority("");
    setTags("");
    setStartDate("");
    setDueDate("");
    setAssigneeUserId("");
    setListSubTask([]);
    setProfilePic(null);
    setIsLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if(type == "create")
    {
      try {
        setIsLoading(true);

        if(profilePic)
        {
          const uploadImageResult = await uploadSingleImage(profilePic);
          profileImageUrl = uploadImageResult.imageUrl || ""; 
        }

        if(!startDate) startDate = new Date();
        if(!dueDate) dueDate = new Date();

        let dataObject = {title, description, tags, startDate, sub_tasks: listSubTask, dueDate, projectId, assigneeUserId, imageTask: profileImageUrl}

        if(status) dataObject.status = status;
        if(priority) dataObject.priority = priority;

        const response = await axiosInstance.post(API_PATHS.TASK.CREATE, dataObject);

        // console.log(response.data);
        closeModalNewAndEditTask();
        dispatch(addTask(response.data.task));
        toast.success("Create a new task successfully");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error("Create a new task fail");
      }
    }
    else
    {
      try {
        setIsLoading(true);

        if(!profilePic)
        {
          profileImageUrl = ""
        }
        else if(profilePic && profilePic != data?.imageTask)
        {
          const uploadImageResult = await uploadSingleImage(profilePic);
          profileImageUrl = uploadImageResult.imageUrl || ""; 
        }
        else
        {
          profileImageUrl = data?.imageTask
        }

        const response = await axiosInstance.patch(API_PATHS.TASK.UPDATE_TASK(data?._id), {
          title, description, status, priority, tags, startDate, sub_tasks: listSubTask, dueDate, projectId, imageTask: profileImageUrl, assigneeUserId
        });
        closeModalNewAndEditTask();
        dispatch(updateTask(response.data.task));
        toast.success("Updated task successfully");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error("Updated task fail");
      }
    }
  }


  return (
    <Modal isOpen={isOpen} onClose={closeModalNewAndEditTask} title={type == "create" ? "Create New Task" : `Edit Task ${data.title.toUpperCase()}`}>
      <form className='mt-4' onKeyDown={handleFormKeyDown} onSubmit={handleSubmit}>

        <div className='mt-3'>
          <PictureSelect image={profilePic} setImage={setProfilePic} shape="s" iconFirst={CiImageOn}/>
        </div>

        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Task Title"
          id="title"
        />

        <div className='mt-3 flex flex-col'>
          <label htmlFor='description' className='text-slate-800 text-[14px] pl-1 font-medium dark:text-white'>Description</label>
          <textarea
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id='description'
            className='w-full px-4 pt-3 outline-none rounded-lg text-gray-900 text-sm mt-1 border dark:bg-dark-tertiary dark:text-white border-gray-100 dark:border-gray-600 overflow-y-auto custom-scrollbar'
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2 mt-3">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" disabled={true}>Select Status</option>
            <option value={"To Do"}>To Do</option>
            <option value={"Work In Progress"}>Work In Progress</option>
            <option value={"Under Review"}>Under Review</option>
            <option value={"Completed"}>Completed</option>
          </select>

          <select
            className={selectStyles}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="" disabled>Select Priority</option>
            <option value={"Urgent"}>Urgent</option>
            <option value={"High"}>High</option>
            <option value={"Medium"}>Medium</option>
            <option value={"Low"}>Low</option>
            <option value={"Backlog"}>Backlog</option>
          </select>
        </div>

        <Input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          id="tag"
          label="Tags"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            id="startDate"
            label="Start Date"
          />

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            id="dueDate"
            label="Due Date"
          />
        </div>

        <div className={`mt-5 mb-2 p-2 rounded-md border border-dashed border-gray-300 dark:border-slate-500`}>
          <p className=' text-gray-900 text-[14px] pl-1 font-medium dark:text-white'>List Sub Tasks</p>
          <InputSubTask listSubTask={listSubTask} setListSubTask={setListSubTask}/>
        </div>

        <div className="grid grid-cols-1  mt-3">
          <div>
            <label htmlFor="" className='text-slate-800 text-[14px] pl-1 font-medium dark:text-white'>Assigned User ID</label>
            <select
              className={selectStyles + " mt-2"}
              value={assigneeUserId}
              onChange={(e) => setAssigneeUserId(e.target.value)}
            >
              <option value="">No One</option>
              { type == "create" ? 
                members?.map(member => (
                  <option key={member._id} value={member._id}>{member.fullname}</option>
                ))
                :
                membersUpdate?.map(member => (
                  <option key={member._id} value={member._id}>{member.fullname}</option>
                ))
              }
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent 
            bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading? "cursor-not-allowed opacity-50" : ""}`}
            disabled={!isFormValid() || isLoading}
        >
          {type == "create" ? "Create Task" : "Update"}
        </button>
      </form>
    </Modal>
  )
}

export default ModalNewTask