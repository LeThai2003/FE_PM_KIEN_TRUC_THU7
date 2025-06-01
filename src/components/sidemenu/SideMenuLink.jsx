import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

const SideMenuLink = ({href, icon : Icon, label}) => {

  const {pathname} = useLocation();
  const isActive = pathname === href || (pathname === "/" && label === "Home");

  return (
    <Link className='w-full' to={href}>
      <div className={`relative px-6 py-3 flex items-center justify-start gap-2 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-blue-50 dark:bg-gray-600" : ""}`}>
        {isActive && <div className='absolute top-0 left-0 h-full w-[5px] bg-blue-200'></div>}
        {Icon && <Icon className={`size-5 font-medium ${isActive ? "text-blue-500" : "text-gray-800"} dark:text-gray-100`} />}
        <span className={` ${isActive ? "text-blue-500" : "text-gray-800"} dark:text-gray-100 overflow-hidden whitespace-nowrap text-ellipsis`}>{label}</span>
      </div>
    </Link>
  )
}

export default SideMenuLink