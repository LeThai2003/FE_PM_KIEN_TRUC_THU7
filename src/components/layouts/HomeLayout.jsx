import React, { useEffect } from 'react'
import SideMenu from '../sidemenu/SideMenu'
import Navbar from '../navbar/Navbar'
import { useSelector } from 'react-redux'

const HomeLayout = ({children}) => {

  const {isDarkMode} = useSelector(state => state.globals);
  const {isSiderMenuCollapsed} = useSelector(state => state.globals);


  useEffect(() => {
    if(isDarkMode)
    {
      document.documentElement.classList.add("dark");   // vì không thể thay đổi bên css bên layout (root)
    }
    else
    {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode])

  return (
    <div className='flex min-h-screen w-full bg-gray-50 text-gray-900'>
      
      <SideMenu/>

      <main className={`flex flex-col w-full bg-gray-50 dark:bg-dark-bg ${isSiderMenuCollapsed ? "" : "md:pl-[250px]"}`}>

        <Navbar/>

        <div className='px-3 py-4 '>
          {children}
        </div>

      </main>

    </div>
  )
}

export default HomeLayout