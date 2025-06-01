import React, { useEffect, useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import SideMenuLink from './SideMenuLink';
import { IoHomeOutline, IoSearchOutline, IoSettingsOutline, IoAlert } from "react-icons/io5";
import { MdOutlineViewTimeline } from "react-icons/md";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { FiBriefcase } from "react-icons/fi";
import { AiOutlineAlert } from "react-icons/ai";
import { GoAlert } from "react-icons/go";
import { LuCircleAlert } from "react-icons/lu";
import { BiLayer } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { setIsSiderMenuCollapsed } from '../../redux/globals';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { setProjects } from '../../redux/projects/projectSlice';

const SideMenu = () => {

  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  
  const dispatch = useDispatch();
  const {isSiderMenuCollapsed} = useSelector(state => state.globals);
  const dataProjects = useSelector(state => state.projects.projects);

  // const [dataProjects, setDataProjects] = useState([]);

  useEffect(() => {

    const getProject = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.PROJECT.GET_ALL);
        // console.log(response.data);
        dispatch(setProjects(response.data.projects));
      } catch (error) {
        console.log(error);
      }
    }

    getProject();

  }, [])
  

  return (
    <div className={`flex flex-col fixed h-full shadow-xl transition-all duration-300 bg-white dark:bg-dark-bg ${isSiderMenuCollapsed ? "w-0 hidden" : "w-[250px]"}  z-50 `}>
      
      <div className='flex justify-between items-center px-6 pt-4 pb-5 dark:bg-black border-b-[1.5px] border-gray-200 dark:border-gray-700'>
        <div className='text-xl font-bold text-gray-900 tracking-wide dark:text-white'>EJIRA</div>
        <button>
          <MdOutlineClose onClick={() => dispatch(setIsSiderMenuCollapsed(true))} className='text-2xl text-gray-800 hover:text-gray-500 dark:text-white'/>
        </button>
      </div>

      <div className='overflow-y-auto custom-scrollbar'>
        <div className='px-6 py-4 border-b-[1.5px] border-gray-200 flex items-center gap-5 dark:border-gray-700 dark:bg-black'>
          <img src="/logo.png" alt="logo image" width={50} height={50} />
          <div>
            <h3 className="text-sm font-bold tracking-wide dark:text-gray-200">EJIRA TEAM</h3>
            <div className='flex items-center justify-start gap-2 mt-1'>
              <CiLock className='size-4 dark:text-white'/>
              <p className='text-xs text-gray-500'>Private</p>
            </div>
          </div>
        </div>

        <div className='w-full'>
          <SideMenuLink label="Home" href="/" icon={IoHomeOutline}/>
          <SideMenuLink label="Timeline" href="/timeline" icon={MdOutlineViewTimeline}/>
          <SideMenuLink label="Search" href="/search" icon={IoSearchOutline}/>
          <SideMenuLink label="Settings" href="/settings" icon={IoSettingsOutline}/>
        </div>

        <button onClick={() => setShowProjects(!showProjects)} className='w-full flex items-center justify-between text-gray-500 dark:bg-dark-bg px-6 py-3'>
          <p className='text-sm'>Projects</p>
          {showProjects ? <FaChevronUp className='size-3'/> : <FaChevronDown className='size-3'/> }
        </button>
        {showProjects && dataProjects?.map((project, index) => (
          <SideMenuLink key={project._id} label={project?.name} href={`/project/${project._id}`} icon={FiBriefcase}/>
        ))}

        <button onClick={() => setShowPriority(!showPriority)} className='w-full flex items-center justify-between text-gray-500 dark:bg-dark-bg px-6 py-3'>
          <p className='text-sm'>Priorities</p>
          {showPriority ? <FaChevronUp className='size-3'/> : <FaChevronDown className='size-3'/> }
        </button>
        {showPriority && (<>
          <SideMenuLink label="Urgent" href="/task/priority/Urgent" icon={AiOutlineAlert}/>
          <SideMenuLink label="High" href="/task/priority/High" icon={LuCircleAlert}/>
          <SideMenuLink label="Medium" href="/task/priority/Medium" icon={GoAlert}/>
          <SideMenuLink label="Low" href="/task/priority/Low" icon={IoAlert}/>
          <SideMenuLink label="Backlog" href="/task/priority/Backlog" icon={BiLayer}/>
        </>)}
      </div>

    </div>
  )
}

export default SideMenu