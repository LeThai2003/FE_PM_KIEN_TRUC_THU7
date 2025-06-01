import React from 'react'

const ChartBoxHeader = ({data, title, children}) => {
  return (
    <div className='h-fit flex flex-col p-6 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-tertiary shadow-md'>
      <h2 className='text-xl font-medium mb-5 text-gray-800 dark:text-white'>{title} ({data.total})</h2>
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default ChartBoxHeader