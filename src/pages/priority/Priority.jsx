import React from 'react'
import { useParams } from 'react-router-dom'
import HomeLayout from '../../components/Layouts/HomeLayout';
import { useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { Collapse } from 'antd';
import PriorityTaskTable from '../../components/tables/PriorityTaskTable';
import { useState } from 'react';

const { Panel } = Collapse;

const Priority = () => {

  const {priority} = useParams();
  const [datas, setDatas] = useState([]);

  useEffect(() => {

    const getDatas = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASK.PRIORITY(priority));
        setDatas(response.data.dataPriorityTasks);
      } catch (error) {
        console.log(error);
      }
    }

    getDatas();
    
  }, [priority]);

  return (
    <HomeLayout>
      <h2 className='text-lg font-medium text-gray-800 dark:text-gray-200 my-4'>Task Priority: {priority}</h2>
      {datas.length > 0 ? (
        <Collapse  >
          {datas.map(data => (
            <Panel showArrow={true} header={data.project.name} key={data.project.id}>
              <PriorityTaskTable data={data.tasks}/>
            </Panel>
          ))}
        </Collapse>
      ) : (
        <div>
          No Data
        </div>
      )}
    </HomeLayout>
  )
}

export default Priority