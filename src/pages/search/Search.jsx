import React, { useCallback, useEffect } from 'react'
import HomeLayout from '../../components/Layouts/HomeLayout'
import { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { debounce } from 'lodash';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import ProjectCard from '../../components/projects/ProjectCard';
import TaskCard from '../../components/tasks/TaskCard';
import UserCard from '../../components/users/UserCard';

const Search = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState({});
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
    if(search.trim().length < 3)
    {
      setSearchResult([]);
      return;
    }

    setIsLoading(true);

    try {
      const getDataSearch = async () => {
        const response = await axiosInstance.post(API_PATHS.SEARCH.ANYTHING, {search});
        console.log(response.data);
        setSearchResult(response.data);
      }
      getDataSearch();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [search]);

  console.log(searchResult);

  return (
    <HomeLayout>
      <div className='relative flex items-center'>
        <input 
          type="text" 
          className='w-72 outline-none border bg-slate-100 border-slate-200 dark:border-gray-600 dark:bg-dark-tertiary text-slate-800 dark:text-white pl-8 pr-4 py-1 rounded-lg text-sm'
          placeholder='Search Anything: Project, Task, User'
          onChange={handleSearch}
        />
        <IoSearchOutline className='absolute left-2 top-[8px] size-4 dark:text-white'/>
      </div>

      {
        isLoading ? "Loading..." : 
        (searchResult?.projects?.length > 0 || searchResult?.tasks?.length >0 || searchResult?.users?.length > 0) &&
        <div className=''>
          {
            searchResult?.projects?.length > 0 && 
            <div className='mt-5 bg-white dark:bg-dark-secondary rounded-lg py-3 px-3 drop-shadow-md dark:text-gray-200 dark:border dark:border-gray-600'>
              <h2 className="uppercase text-base font-semibold tracking-wide mb-2 border-b border-gray-200 pb-1 dark:text-gray-200">
                Projects
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {searchResult?.projects?.map(project => (
                  <ProjectCard key={project._id} project={project}/>
                ))}
              </div>
            </div>
          }

          {
            searchResult?.tasks?.length > 0 && 
            <div className='mt-5 bg-white dark:bg-dark-secondary rounded-lg py-3 px-3 drop-shadow-md dark:text-gray-200 dark:border dark:border-gray-600'>
              <h2 className="uppercase text-base font-semibold tracking-wide mb-2 border-b border-gray-200 pb-1 dark:text-gray-200">
                Tasks
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {searchResult?.tasks?.map(task => (
                  <TaskCard key={task._id} task={task}/>
                ))}
              </div>
            </div>
          }

          {
            searchResult?.users?.length > 0 && 
            <div className='mt-5 bg-white dark:bg-dark-secondary rounded-lg py-3 px-3 drop-shadow-md dark:text-gray-200 dark:border dark:border-gray-600'>
              <h2 className="uppercase text-base font-semibold tracking-wide mb-2 border-b border-gray-200 pb-1 dark:text-gray-200">
                Users
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {searchResult?.users?.map(user => (
                  <UserCard key={user._id} user={user}/>
                ))}
              </div>
            </div>
          }

        </div>
      }

    </HomeLayout>
  )
}

export default Search