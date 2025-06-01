import React from 'react'

const Modal = ({isOpen, onClose, title, children, widthTight}) => {

  if(!isOpen) return;

  return (
    <div className='fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center w-full h-full max-h-full overflow-y-auto custom-scrollbar overflow-x-hidden bg-black/40'>
      
      <div className={`${widthTight ? "max-w-xl" : "max-w-2xl"} relative p-4 my-20 w-full max-h-full z-100`}>
        <div className='relative bg-white dark:bg-dark-tertiary rounded-lg shadow-sm'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>{title}</h3>

            <button
              id='close_modal'
              onClick={onClose}
              type='button'
              className='text-gray-400 hover:bg-gray-200 dark:text-white dark:hover:bg-slate-600 hover:text-gray-900 rounded-lg size-8 flex items-center justify-center cursor-pointer'
            >
              X
            </button>
          </div>

          <div className='p-4 pt-3'>
            {children}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Modal
