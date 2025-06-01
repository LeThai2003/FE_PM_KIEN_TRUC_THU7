import React, { useState, useCallback, useEffect } from 'react'
import Modal from '../Modal';
import { IoSearchOutline } from 'react-icons/io5';
import { getNameInitials } from '../../utils/helper';
import { debounce } from 'lodash';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPath';
import { useParams } from 'react-router-dom';


const ModalAddMember = ({isOpen, onClose}) => {

  const {id} = useParams();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (memberId) => {
    try {
      await axiosInstance.post(API_PATHS.PROJECT.ADD_MEMBER(id), {memberId});
      setSearchResult(prev => prev.map(u => u._id == memberId ? ({...u, status: "Inviting"}) : u));
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemove = async (memberId) => {
    await axiosInstance.post(API_PATHS.PROJECT.REMOVE_MEMBER_INVITING(id), {memberId});
    setSearchResult(prev => prev.map(u => u._id == memberId ? ({...u, status: "User"}) : u));
  }

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
    if("@gmail.com".includes(search) || search.trim().length < 3)
    {
      setSearchResult([]);
      return;
    }

    setIsLoading(true);

    try {
      const getDataUser = async () => {
        const response = await axiosInstance.post(API_PATHS.SEARCH.ADD_MEMBER_TO_PROJECT(id), {search});
        console.log(response.data);
        setSearchResult(response.data.users)
      }
      getDataUser();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [search]);

  const handleClose = () => {
    onClose();
    setSearchResult([]);
    setSearch("");
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Member To Project" widthTight={true}>
      <div className='w-full py-3 flex flex-col'>
        <div className='relative flex items-center'>
          <input 
            type="text" 
            className='w-72 outline-none border bg-gray-100 dark:border-gray-600 dark:bg-dark-tertiary dark:text-white pl-8 pr-4 py-1 rounded-lg text-sm'
            placeholder="Find by name or email"
            onChange={handleSearch}
          />
          <IoSearchOutline className='absolute left-2 top-[8px] size-4 dark:text-white'/>
        </div>

        <div className='flex flex-col h-[380px] overflow-y-auto custom-scrollbar pr-2 mt-2'>
          <div className=''>
            {isLoading ? "Loading..." : <>
              {
                searchResult?.map((member, index) => (
                  <div key={index} className='flex items-center justify-between w-full my-3 px-2 py-3 border border-gray-100 rounded-md dark:border-gray-600 bg-white dark:bg-dark-secondary'>
                    
                    <div className='flex justify-start gap-3 items-center'>
                      {member.profilePicture ? 
                        <img
                          src={member.profilePicture}
                          alt='profile image'
                          className='size-14 rounded-full flex object-cover items-center justify-center border border-blue-200 dark:border-gray-200'
                        /> 
                        : 
                        <div className='size-14 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                          {getNameInitials(member.fullname)}  
                        </div>
                      }

                      <div className='flex flex-col'>
                        <h3 className='text-sm font-medium dark:text-gray-200'>{member.fullname}</h3>
                        <span className='text-xs text-gray-600 dark:text-gray-200 mt-1'>{member.email}</span>
                        <p className='text-xs text-gray-600 dark:text-gray-200 mt-1'>{member?.description}</p>
                      </div>
                    </div>

                    {
                      member.status == "Inviting" ? 
                        (
                          <button 
                            className='mr-1 px-4 py-1 border border-red-200 dark:border-gray-600 bg-red-50 hover:bg-red-100 dark:bg-slate-700 dark:hover:bg-opacity-85 text-red-500 dark:text-gray-200 flex items-center justify-center rounded-md text-sm font-medium'
                            onClick={() => handleRemove(member._id)}   // thay index = id
                          >
                            REMOVE
                          </button>
                        )
                      : member.status == "User" ? 
                        (
                          <button 
                            className='mr-1 px-4 py-1 border border-blue-200 dark:border-gray-600 bg-blue-50 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-opacity-85 text-blue-500 dark:text-gray-200 flex items-center justify-center rounded-md text-sm font-medium'
                            onClick={() => handleAdd(member._id)}
                          >
                            ADD
                          </button>
                        )
                      : member.status == "Creator" ? 
                        (
                          <p className='mr-2 text-purple-700 dark:text-yellow-400  text-sm font-medium'>
                            Creator
                          </p>
                        )
                      : 
                        (
                          <p className='mr-2 text-violet-500 dark:text-yellow-200 text-sm font-medium'>
                            Member
                          </p>
                        )

                        
                      
                    }

                  </div>
                ))}
              </>
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalAddMember