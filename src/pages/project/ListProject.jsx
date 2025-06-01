import React from 'react'
import TaskCard from '../../components/tasks/TaskCard'

const ListProject = ({data, setIsModalNewTaskOpen}) => {
  return (
    <div className='p-4'>
      <button className='flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
        onClick={() => setIsModalNewTaskOpen(true)}
      >
        Add New Task
      </button>

      {data.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {data.map(task => (
            <TaskCard key={task._id} task={task}/>
          ))}
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  )
}

export default ListProject