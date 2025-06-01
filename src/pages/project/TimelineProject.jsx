import React, { useMemo, useState } from 'react'
import {Gantt, ViewMode} from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { useSelector } from 'react-redux'

const TimelineProject = ({data: tasks, setIsModalNewTaskOpen}) => {

  const {isDarkMode} = useSelector(state => state.globals);

  const [displayOptions, setDisplayOptions] = useState({
    viewMode: ViewMode.Month,
    locale: "en-US"
  });

  const ganttTasks = useMemo(() => {
    return(
      tasks?.map((task) => ({
        start: new Date(task.startDate),
        end: new Date(task.dueDate),
        name: task.title,
        id: `Task-${task._id}`,
        type: "task",
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false
      })) || []
    )
  }, [tasks]);

  const handleViewModeChange = (event) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value,
    }));
  };

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-2 py-5'>
        <h1></h1>
        <div className='relative inline-block w-64'>
          <select className='focus:shadow-outline focus:outline-none block w-full rounded border border-gray-400 bg-white appearance-none px-4 py-2 pr-8 leading-tight shawdow hover:border-gray-500 dark:border-dark-secondary dark:bg-dark-secondary dark:text-white'
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>
      <div className='overflow-hidden rounded-md bg-white shadow dark:text-white dark:bg-dark-secondary'>
        <div className='timeline'>
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth='150px'
            barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}     
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}     
          />
        </div>
        <div className='px-4 pb-5 pt-1'>
          <button className='flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimelineProject