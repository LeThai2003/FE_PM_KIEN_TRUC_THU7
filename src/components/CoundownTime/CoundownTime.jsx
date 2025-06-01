import React, { useEffect, useState } from 'react'
import { IoReloadOutline } from "react-icons/io5";

const CoundownTime = ({time, onLoadAgain}) => {

  const [timeLeft, setTimeLeft] = useState(time);
  const [isTimeEnd, setIsTimeEnd] = useState(false);

  // giảm 1s
  useEffect(() => {
    if(timeLeft <= 0)
    {
      setIsTimeEnd(true)
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((e) => e - 1);
    }, 1000)

    return () => clearInterval(timer); 

  }, [timeLeft]);

  // chuyển đổi sang phút
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`; 
  }
  
  const handleGenerateAgain = () => {
    onLoadAgain();
    setTimeLeft(time);
    setIsTimeEnd(false);
  }

  return (
    <>
      {isTimeEnd ? 
        <div className='px-4 py-1 mt-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer' onClick={handleGenerateAgain}>
          <span className='flex items-center justify-center text-white font-medium'><IoReloadOutline className='text-lg mr-2'/> Tạo Lại OTP</span>
        </div>
      : 
        <div className='font-medium text-sm'>
          OTP code expires in: <span className='text-green-700 font-medium bg-gray-100 px-2 py-1 rounded'>{formatTime(timeLeft)}</span> minutes
        </div>
      }
    </>
  )
}

export default CoundownTime
