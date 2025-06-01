import React from 'react'
import moment from 'moment'
import { getNameInitials } from '../../utils/helper';

const ProjectCard = ({project}) => {

  // console.log(project);

  const startDateFormat = project.startDate ? moment(new Date(project.startDate)).format("DD/MM/yyyy") : "Not set";
  const endDateFormat = project.endDate ? moment(new Date(project.endDate)).format("DD/MM/yyyy") : "Not set";

  const members = [];
  members.push(project.authorUserId);

  if(project.membersId?.length > 0)
  {
    project.membersId.forEach(m => members.push(m));
  }

  return (
    <div className='mt-3 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-3 tracking-[0.25px] flex flex-col gap-2'>
      <h3 className='text-sm font-medium dark:text-gray-200'>Name: <span className='font-normal'>{project.name}</span></h3>
      <p className='text-sm font-medium'>Description: <span className='font-normal'>{project.description}</span></p>
      <p className='text-sm font-medium'>Start date: <span className='font-normal text-green-700 dark:text-green-400'>{startDateFormat}</span></p>
      <p className='text-sm font-medium'>End date: <span className='font-normal text-red-700 dark:text-yellow-400'>{endDateFormat}</span></p>
      <div className='flex gap-2 items-center'>
        <p className='text-sm font-medium'>Members:</p>
        <div className='flex -space-x-[7px]'>
          {
            members.map(member => (
              member.profilePicture ? 
                <div className='border border-gray-200 rounded-full'>
                  <img
                    src={member.profilePicture}
                    alt='image assignee'
                    width={30}
                    height={30}
                    className='size-8 rounded-full object-cover dark:border-dark-secondary'
                  />
                </div>
                :
                <div className='size-8 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                  {getNameInitials(member.fullname)}  
                </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ProjectCard