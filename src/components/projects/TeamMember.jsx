import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { getNameInitials } from '../../utils/helper';
import ModalAllTeamInProject from './AllTeamInProject';
import ModalAddMember from './ModalAddMember';
import { CiEdit } from "react-icons/ci";
import {useSelector} from "react-redux"
import { Tooltip } from 'antd';
import ImageWithPreview from '../images/ImageWithPreview';


const TeamMember = ({dataProject, modalNewProjectOpen, setModalNewProjectOpen}) => {

  // console.log(dataProject);

  const [isModalAllTeamInProjectOpen, setIsModalAllTeamInProjectOpen] = useState(false); 
  const [isModalAddMemberOpen, setIsModalAddMemberOpen] = useState(false); 

  const dataTeams = [{...dataProject?.authorUserId, creator: true, totalCreate: 0, totalAssign: 0}];
  dataProject?.membersId?.forEach(m => dataTeams.push({...m, totalCreate: 0, totalAssign: 0}));

  const {currentUser} = useSelector(state => state.users);

  const {tasks} = useSelector(state => state.tasks);
  // console.log("------------team-------------", dataTeams);

  if(tasks.length > 0)
  {
    for (const task of tasks) {
      let authorTask = dataTeams.find(m => m._id == task.authorUserId._id);
      if(authorTask)
      {
        authorTask.totalCreate += 1;
      }
      let assigneeTask = dataTeams.find(m => m._id == task.assigneeUserId?._id);
      if(assigneeTask)
      {
        assigneeTask.totalAssign += 1;
      }
    }
  }
  // console.log(allowEdit);

  return (
    <>
      <ModalAllTeamInProject
        isOpen={isModalAllTeamInProjectOpen}
        onClose={() => setIsModalAllTeamInProjectOpen(false)}
        dataMemeber={dataTeams}
        tasks={tasks}
      />

      <ModalAddMember
        isOpen={isModalAddMemberOpen}
        onClose={() => setIsModalAddMemberOpen(false)}
      />

      <div className='flex w-full items-start justify-between px-3 pt-1 pb-3 flex-wrap-reverse'>
     
        <div className='flex items-center gap-2 mt-1'>
          <h2 className={`text-2xl font-semibold dark:text-white`}>{dataProject && dataProject.name}</h2>
          {
            dataProject?.authorUserId?._id == currentUser._id && 
            <button 
              className='w-[35px] h-[35px] hover:bg-blue-50 hover:text-blue-500 rounded-md flex items-center justify-center text-slate-500 dark:text-gray-400 text-xl dark:hover:bg-slate-700 dark:hover:text-white'
              onClick={() => setModalNewProjectOpen({type: "edit", isOpen: true, data: dataProject})}
            >
              <CiEdit className='-mb-[2px] cursor-pointer' size={20}/> 
            </button>
          
          }
        </div>
   
        <div className='flex justify-end'>
          <div className='flex w-fit flex-col bg-white px-4 py-2 border border-gray-100 rounded-md dark:bg-dark-secondary dark:border-gray-600 dark:text-white'>
            <div className={`${dataTeams?.length >= 6 ? "w-96" : "w-64"} flex items-center justify-between mb-2`}>
              <h3 className='font-medium text-sm dark:text-white'>Team Members</h3>
              <button 
                onClick={() => setIsModalAllTeamInProjectOpen(true)}
                className='text-sm px-3 py-1 rounded-md border border-gray-100 dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:hover:bg-dark-tertiary bg-white hover:bg-gray-200'
              >
                View All
              </button>
            </div>
            <div className={`flex ${dataTeams?.length >= 6 ? "w-96" : "w-64"} flex-wrap gap-1`}>
              {
                dataTeams.length > 0 ? (
                <>
                  {dataTeams.map((item, index) => (
                    <Tooltip
                      title={item.fullname}
                      placement='top'
                      zIndex={1}
                      key={item._id}
                    >
                      {item.profilePicture ? (
                        <div className='h-full flex items-center'>
                          <ImageWithPreview src={item.profilePicture} width={36} height={36}/>
                        </div>
                      ) : (
                        <div className='size-9 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                          {getNameInitials(item.fullname)}
                        </div>
                      )}
                    </Tooltip>
                  ))}
                  {
                    dataProject?.authorUserId?._id == currentUser._id &&
                    <button 
                      onClick={() => setIsModalAddMemberOpen(true)}
                      className='size-9 rounded-full border border-blue-100 dark:border-gray-100 flex items-center justify-center bg-blue-50 dark:bg-slate-800 dark:hover:bg-dark-tertiary hover:bg-blue-100 dark:hover:opacity-85'
                    >
                      <FiPlus className='size-5 text-blue-600 dark:text-gray-200'/>
                    </button>
                  }
                </>
              ) : (
                <>
                  {
                    dataProject?.authorUserId?._id == currentUser._id &&
                    <button 
                      onClick={() => setIsModalAddMemberOpen(true)}
                      className='size-9 rounded-full border border-blue-100 dark:border-gray-100 flex items-center justify-center bg-blue-50 dark:bg-slate-800 dark:hover:bg-dark-tertiary hover:bg-blue-100 dark:hover:opacity-85'
                    >
                      <FiPlus className='size-5 text-blue-600 dark:text-gray-200'/>
                    </button>
                  }
                </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TeamMember
