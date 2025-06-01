import React, { useEffect, useMemo, useState } from 'react'
import {Gantt, ViewMode} from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { useSelector } from 'react-redux'
import HomeLayout from '../../components/Layouts/HomeLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'

const Timeline = () => {

  const {projects} = useSelector(state => state.projects);
  const {isDarkMode} = useSelector(state => state.globals);
  const {tasks} = useSelector(state => state.tasks);

  const [dataPercentCompleted, setDataPercentCompleted] = useState([]);

  const [displayOptions, setDisplayOptions] = useState({
    viewMode: ViewMode.Month,
    locale: "en-US"
  });

  useEffect(() => {
    const getPerentProjects = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.PROJECT.GET_PERCENT_COMPELETED);
        setDataPercentCompleted(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };

    getPerentProjects();
  }, [projects, tasks]);

  let dataProjectResult = projects.length > 0 ? projects.map(project => {
    const percent = dataPercentCompleted.find(item => item.projectId == project._id)?.percent;
    return {...project, percent};
  }) : [];

  console.log(dataProjectResult);

  const ganttTasks = useMemo(() => {
    return(
      dataProjectResult?.map((project) => ({
        start: new Date(project.startDate),
        end: new Date(project.endDate),
        name: project.name,
        id: `project-${project._id}`,
        type: "project",
        progress: project.percent,
        isDisabled: false
      })) || []
    )
  }, [projects, dataPercentCompleted])

  const handleViewModeChange = (event) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value,
    }));
  };

  return (
    <HomeLayout>
      <div className='flex flex-wrap items-center justify-between gap-2 py-5'>
        <h1 className='me-2 text-lg font-bold dark:text-white'>
          Project Tasks Timeline
        </h1>
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
      </div>
    </HomeLayout>
  )
}

export default Timeline