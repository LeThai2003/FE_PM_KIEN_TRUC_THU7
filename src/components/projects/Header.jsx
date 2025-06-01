import React from 'react'

const Header = ({name, buttonComponet, isSmallText}) => {
  return (
    <div className='flex items-center justify-between'>
      <h2 className={`${isSmallText ? "text-lg" : "text-2xl"} font-semibold dark:text-white`}>{name}</h2>
      {buttonComponet}
    </div>
  )
}

export default Header