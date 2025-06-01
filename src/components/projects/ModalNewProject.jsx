import React, { useEffect, useState } from 'react'
import Modal from '../Modal';
import Input from '../inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useDispatch } from 'react-redux';
import { addProject, updateProject } from '../../redux/projects/projectSlice';

const ModalNewProject = ({isOpen, onClose, type, data}) => {

  // console.log(data);

  const dispatch = useDispatch();

  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [startDate, setStartDate] = useState(data?.startDate.split("T")[0] || "");
  const [endDate, setEndDate] = useState(data?.endDate.split("T")[0] || "");

  useEffect(() => {
    if (data?._id) {
      setProjectId(data._id);
    };
    if (data?.name) {
      setProjectName(data.name);
    };
    if (data?.description) {
      setDescription(data.description);
    };
    if (data?.startDate) {
      setStartDate(data.startDate.split("T")[0]);
    };
    if (data?.endDate) {
      setEndDate(data.endDate.split("T")[0]);
    };
  }, [data]);

  // console.log(data?.name, projectName);

  const isFormValid = () => {
    return projectName && startDate && endDate;
  };

  const closeModalAndClearFields = () => {
    onClose();
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  }


  const handleSubmit = async () => {
    if(type == "edit")
    {
      try {
        const response = await axiosInstance.patch(API_PATHS.PROJECT.UPDATE, {
          projectId, projectName, description, startDate, endDate
        });
        closeModalAndClearFields();
        console.log(response.data);
        dispatch(updateProject(response.data.project));
      } catch (error) {
        console.log(error);
      }
    }
    else
    {
      try {
        const response = await axiosInstance.post(API_PATHS.PROJECT.CREATE, {
          projectName, description, startDate, endDate
        });
        closeModalAndClearFields();
        dispatch(addProject(response.data.project));
      } catch (error) {
        console.log(error);
      }
    }
  } 


  return (
    <Modal isOpen={isOpen} onClose={closeModalAndClearFields} title={type == "edit" ? <><span>Update Project <i>"{data && data.name}"</i></span></> : "Create New Project"}>
      <form 
        className='mt-1 space-y-6'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit()
        }}
      >
        <Input 
          type='text'
          placeholder='Project Name'
          value={projectName}
          onChange={({target}) => setProjectName(target.value)}
          id="projectName"
          label="Project Name"
        />

        <div className='mt-3 flex flex-col'>
          <label htmlFor='description' className='text-slate-800 text-[14px] pl-1 font-medium dark:text-white'>Description</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id='description'
            className='w-full px-4 pt-3 outline-none rounded-lg text-gray-900 text-sm mt-1 border dark:bg-dark-tertiary dark:text-white border-gray-100 dark:border-gray-600'
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            id='startDate'
            label="Start Date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            id='endDate'
            label="End Date"
          />
        </div>
        <button type='submit' className={`focus-offset-2 mt-4 flex justify-center w-full rounded-md border border-transparent 
          bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none 
          ${!isFormValid() ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={!isFormValid()}
        >
          {type == "edit" ? "Update Project" : "Create Project"}
        </button>
      </form>
    </Modal>
  )
}

export default ModalNewProject