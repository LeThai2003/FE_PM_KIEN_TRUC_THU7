import React from 'react'
import Modal from '../Modal'
import {useParams} from "react-router-dom"
import { IoSearchOutline } from 'react-icons/io5';
import { getNameInitials } from '../../utils/helper';
import { useState } from 'react';
import { debounce } from 'lodash';
import { useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPath';
import { useCallback } from 'react';
import { convertToSlug } from '../../utils/converToSlug';

const ModalAllTeamInProject = ({isOpen, onClose, dataMemeber, tasks}) => {

  const {id} = useParams();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(dataMemeber);
  const [isLoading, setIsLoading] = useState(false);


  const handleSearch = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  useEffect(() => {

    if(search.trim().length < 3 )
    {
      setSearchResult([]); 
      if(search.length == 0)
      {
        setSearchResult(dataMemeber);
      }
      return;
    } 
    setIsLoading(true);
    try {
      const searchSlug = convertToSlug(search);
      const filterUsers = dataMemeber.filter(user =>
        user.slugName.includes(searchSlug) ||
        user.email.includes(search)
      );
      setSearchResult(filterUsers);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [search, id, dataMemeber]);

  // console.log(searchResult);

  const handleClose = () => {
    setSearchResult(dataMemeber);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="All Members in Project" widthTight={true}>
      <div className='w-full py-3 flex flex-col'>
        <div className='relative flex items-center'>
          <input 
            type="text" 
            className='w-72 outline-none border bg-gray-100 dark:border-gray-600 dark:bg-dark-tertiary dark:text-white pl-8 pr-4 py-1 rounded-lg text-sm'
            placeholder='Search Member'
            onChange={handleSearch}
          />
          <IoSearchOutline className='absolute left-2 top-[8px] size-4 dark:text-white'/>
        </div>

        <div className='flex flex-col h-[380px] overflow-y-auto custom-scrollbar pr-2 mt-2'>
          <div className=''>
            {isLoading ? "Loading..." : <>
              {searchResult?.map((member, index) => (
                <div key={index} className={`flex items-center justify-between w-full my-3 px-2 py-3 rounded-md  ${member.creator ? "border-2 border-dashed border-red-100 dark:border-gray-300" : "border border-gray-100 dark:border-gray-600"} bg-white dark:bg-dark-secondary`}>
                  
                  <div className='flex justify-start gap-3 items-center'>
                    {member.profilePicture ? 
                      <img
                        src={member.profilePicture}
                        alt='profile image'
                        className='size-14 rounded-full object-cover flex items-center justify-center border border-blue-200 dark:border-gray-200'
                      /> 
                      : 
                      <div className='size-14 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                        {getNameInitials(member.fullname)}  
                      </div>
                    }

                    <div className='flex flex-col'>
                      <h3 className='text-sm font-medium dark:text-gray-200'>{member.fullname}</h3>
                      <span className='text-xs text-gray-600 dark:text-gray-200 mt-1'>{member.email}</span>
                      <p className='text-xs text-gray-600 dark:text-gray-200 mt-1'>{member?.major}</p>
                    </div>
                  </div>

                  <div className="flex flex-col dark:bg-dark-secondary pr-1">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p className="italic">
                        Created Task: <span className="font-semibold text-blue-600 dark:text-blue-400">{member.totalCreate}</span>
                      </p>
                    </div>
                    <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                      <p className="italic">
                        Assigned Task: <span className="font-semibold text-green-600 dark:text-green-400">{member.totalAssign}</span>
                      </p>
                    </div>
                  </div>

                </div>
              ))}
             
            </>}
          </div>
        </div>

      </div>
    </Modal>
  )
}

export default ModalAllTeamInProject