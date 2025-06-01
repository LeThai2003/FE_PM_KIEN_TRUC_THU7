import React from 'react'

const DeleteAlert = ({content, onDelete}) => {
  return (
    <div>
      <p className='text-sm'>{content}</p>

      <div className='flex justify-end mt-6'>
        <button id='delete' className='text-sm font-semibold px-4 py-2 rounded-md bg-red-100 dark:bg-slate-800 text-red-600 hover:bg-red-200 dark:hover-slate-700 dark:text-gray-200 ' type='button' onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteAlert