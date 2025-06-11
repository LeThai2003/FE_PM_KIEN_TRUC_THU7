import React, { useMemo } from 'react'
import HomeLayout from '../../components/layouts/HomeLayout'
import { useState } from 'react';
import Header from '../../components/projects/Header';
import { FaRegPlusSquare } from 'react-icons/fa';
import ModalNewProject from '../../components/projects/ModalNewProject';
import { useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useSelector } from 'react-redux';
import ColumnBasic from '../../components/charts/ColumnBasic';
import PieBasic from '../../components/charts/PieBasic';
import HomeProjectTable from '../../components/tables/HomeProjectTable';
import ChartBoxHeader from '../../components/charts/ChartBoxHeader';

const Home = () => {
  const [modalNewProjectOpen, setModalNewProjectOpen] = useState(false);
  const [dataTasks, setDataTasks] = useState([]);
  const [dataProjects, setDataProjects] = useState([]);
  const [dataPercentCompleted, setDataPercentCompleted] = useState([]);

  const {tasks} = useSelector(state => state.tasks);
  const {projects} = useSelector(state => state.projects);
  const {currentUser} = useSelector(state => state.users);

  useEffect(() => {
    const getDataTasks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASK.DATA_CHART);
        setDataTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDataTasks();
  }, []);

  useEffect(() => {
    const getDataProjects = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.PROJECT.DATA_CHART);
        setDataProjects(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDataProjects();
  }, [projects]);

  console.log(dataProjects);

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
  }, [projects]);


  let dataProjectResult = useMemo(() => {
    return projects.length > 0
      ? projects.map(project => {
          const percent = dataPercentCompleted.find(item => item.projectId == project._id)?.percent;
          return { ...project, percent };
        })
      : [];
  }, [dataPercentCompleted]);
    
  // console.log(dataProjectResult);


  return (
    <HomeLayout>
      
      <ModalNewProject 
        isOpen={modalNewProjectOpen}
        onClose={() => setModalNewProjectOpen(false)}
        type="create"
        data={null}
      />
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>Welcome, {currentUser.fullname} 👋👋</h3>
        </div>
        <Header
          name={""}
          buttonComponet={
            <button className='flex items-center gap-2 rounded-lg bg-blue-primary hover:bg-blue-600 text-white px-3 py-2'
              onClick={() => setModalNewProjectOpen(true)}
            >
              <FaRegPlusSquare className='-mb-[2px] size-4 text-white'/>New Project
            </button>
          }
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>  
        {dataTasks?.data?.length > 0 &&
          <ChartBoxHeader data={dataTasks} title="Tasks">
            <ColumnBasic data={dataTasks.data}/>
          </ChartBoxHeader>
        }
          
        {dataProjects?.data?.length > 0 &&
          <ChartBoxHeader data={dataProjects} title="Projects">
            <PieBasic data={dataProjects.data}/>
          </ChartBoxHeader>
        }
      </div>

      <div className='my-5'>
        <HomeProjectTable data={dataProjectResult}/>
      </div>

    </HomeLayout>
  )
}

export default Home