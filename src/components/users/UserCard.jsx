import React from 'react'
import { getNameInitials } from '../../utils/helper'

const UserCard = ({user}) => {
  return (
    <div className={`flex flex-col w-full px-2 py-3 rounded-md border border-gray-100 dark:border-gray-600 bg-white dark:bg-dark-secondary`}>              
      <div className='flex justify-start gap-3 items-center'>
        {user.profilePicture ? 
          <img
            src={user.profilePicture}
            alt='profile image'
            className='size-14 object-cover rounded-full flex items-center justify-center border border-blue-200 dark:border-gray-200'
          /> 
          : 
          <div className='size-14 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
            {getNameInitials(user.fullname)}  
          </div>
        }

        <div className='flex flex-col'>
          <h3 className='text-sm font-medium dark:text-gray-200'>{user.fullname}</h3>
          <span className='text-xs text-gray-600 dark:text-gray-200 mt-1'>{user.email}</span>
          <p className='text-xs text-gray-600 dark:text-gray-200 mt-1'>{user?.major}</p>
        </div>
      </div>

      {user.description && <p className='text-sm mt-3 font-medium text-justify'>Description: <span className='font-normal'>{user.description}</span></p>}

    </div>
  )
}

export default UserCard