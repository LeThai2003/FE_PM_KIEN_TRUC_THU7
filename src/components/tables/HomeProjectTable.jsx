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

const HomeProjectTable = ({data}) => {

  console.log(data);

  const navigate = useNavigate();

  const {isDarkMode} = useSelector(state => state.globals);

  const columns = [
    {
      field: "name",
      headerName: "Project Name",
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
      field: "endDate",
      headerName: "End Date",
      // width: 150,
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? moment(new Date(params.value)).format("DD/MM/yyyy") : "Not set"}
        </span>
      ) 
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
      field: "membersId",
      headerName: "Members",
      // width: 200,
      flex: 2,
      renderCell: (params) => (
        <div className='h-full'>
          {params.value?.length > 0 &&
            <div className='h-full flex items-center gap-1'>
              {params.value.map(item => (
                <div key={item._id}>
                  <Tooltip
                    title={item.fullname}
                    placement='bottom'
                    zIndex={1}
                  >
                    {item.profilePicture ? 
                      <div key={item._id} className='h-full flex items-center'>
                        <ImageWithPreview src={item.profilePicture} width={36} height={36}/>
                      </div>
                      // <img
                      //   src={item.profilePicture}
                      //   alt='profile image'
                      //   className='size-9 object-cover rounded-full flex items-center justify-center border border-blue-200 dark:border-gray-200'
                      // /> 
                      : 
                      <div className='size-9 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                        {getNameInitials(item.fullname)}  
                      </div>
                    }
                  </Tooltip>
                </div>
              ))}
            </div>
          }
        </div>
      ) 
    },
    {
      field: "percent",
      headerName: "Progress",
      // width: 160,
      flex: 1,
      renderCell: (params) => (
        <>
          {
            parseInt(params.value) == 100 ? (
              <div className='h-full flex items-center justify-start gap-2'>
                <div className='w-[65%] h-[4px] bg-[#00c9a7] rounded-lg'>

                </div>
                <div className='bg-[#00c9a7] flex items-center justify-center size-3 text-white rounded-full'>
                  <FaCheck className='size-2'/>
                </div>
              </div>
            ) : (
              <div className='h-full flex items-center justify-start gap-2'>
                <div className="relative w-[65%] h-[2px] bg-gray-200 rounded-lg ">
                  <div
                    className="absolute -top-[1px] left-0 h-[4px] bg-[#3f87f5] rounded-lg"
                    style={{ width: `${params.value}%` }}
                  />
                </div>
                <p className="relative text-xs text-gray-800 dark:text-gray-200 mb-0"
                >
                  {params.value}%
                </p>
              </div>
            )
          }
        </>
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
            onClick={() => navigate(`/project/${params.value}`)} 
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

export default HomeProjectTable