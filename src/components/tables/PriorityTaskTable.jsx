import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import moment from "moment";
import { getNameInitials } from '../../utils/helper';
import { FaCheck } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { Modal, Image } from 'antd';
import { useState } from 'react';
import ImagePreviewModal from '../images/ImagePreviewModal';
import ImageWithPreview from '../images/ImageWithPreview';
import { useSelector } from 'react-redux';
import { dataGridSxStyles } from './styleTable';
import { StatusTag } from '../../pages/Task/TaskDetail';

const PriorityTaskTable = ({data}) => {

  const navigate = useNavigate();

  const {isDarkMode} = useSelector(state => state.globals);

  const columns = [
    {
      field: "title",
      headerName: "Task Title",
      // width: 230,
      flex: 1 
    },
    {
      field: "description",
      headerName: "Description",
      // width: 350,
      flex: 2,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      // width: 150,
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? moment(new Date(params.value)).format("DD/MM/yyyy") : "Not set"}
        </span>
      ) 
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      // width: 150,
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? moment(new Date(params.value)).format("DD/MM/yyyy") : "Not set"}
        </span>
      ) 
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {

        return(
          <div className='h-full flex items-center'>
            <StatusTag status={params.value}/> 
          </div> 
        )
      }
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      renderCell: (params) => {
        const taskTagsSplit = params.value ? params.value.split(",") : [];

        return(
          taskTagsSplit.length > 0 && 
          <div className='flex gap-2 items-center h-full'>
            {taskTagsSplit.map((tag) => (
              <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs dark:text-slate-900 font-medium'>
                {" "}{tag}
              </div>
            ))}
          </div>
          
        )
      }
    },



    {
      field: "authorUserId",
      headerName: "Author",
      // width: 110,
      flex: 1,
      renderCell: (params) => (
        <div className='h-full flex items-center'>
          <Tooltip
            title={params.value.fullname}
            placement='top'
            zIndex={1}
          >
            {params.value.profilePicture ? (
              <div className='h-full flex items-center'>
                <ImageWithPreview src={params.value.profilePicture} width={36} height={36}/>
              </div>
            ) : (
              <div className='size-9 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                {getNameInitials(params.value.fullname)}
              </div>
            )}
          </Tooltip>
        </div>
      ) 
    },
    {
      field: "assigneeUserId",
      headerName: "Assignee",
      // width: 110,
      flex: 1,
      renderCell: (params) => (
      params.value ? (
        <div className='h-full flex items-center'>
          <Tooltip title={params.value.fullname} placement='top' zIndex={1}>
            {params.value.profilePicture ? (
              <div className='h-full flex items-center'>
                <ImageWithPreview src={params.value.profilePicture} width={36} height={36} />
              </div>
            ) : (
              <div className='size-9 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                {getNameInitials(params.value.fullname)}
              </div>
            )}
          </Tooltip>
        </div>
      ) : null
    )
    },
    
    {
      field: "_id",
      headerName: "Action",
      // width: 130,
      flex: 1,
      renderCell: (params) => (
        <div className='h-full flex items-center'>
          <button 
            onClick={() => navigate(`/task/${params.value}`)} 
            className='h-fit px-2 py-1 hover:bg-gray-200 dark:hover:bg-transparent rounded-md text-gray-700 dark:text-gray-200 flex items-center justify-start gap-2'
          >
            <FaRegEye className='size-4'/>
            <span>Watch</span>
          </button>
        </div>
      )
    }
  ]

  return (
    <div className=''>
      <DataGrid
        rows={data || []}
        columns={columns}
        getRowId={(row) => row._id}
        className='border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200'
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  )
}

export default PriorityTaskTable