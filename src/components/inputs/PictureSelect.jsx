import React, { useRef, useState } from 'react'
import {LuUser, LuUpload, LuTrash} from "react-icons/lu";

const PictureSelect = ({image, setImage, shape, iconFirst: Icon, isDisable}) => {

  const inputRef = useRef(null);

  const [previewPictureUrl, setPreviewPictureUrl] = useState(image || null);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if(file)
    {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewPictureUrl(preview);
    }

    e.target.value = null;
  }

  const handleChooseFile = () => {
    inputRef.current.click();
  }

  const handleRemove = () => {
    setImage(null);
    setPreviewPictureUrl(null);
    // inputRef.current.value = null;
  }

  return (
    <div className='flex justify-center mt-3 mb-3'>
      <input type="file" accept='image/*' ref={inputRef} onChange={handleChangeImage} disabled={isDisable} className='hidden'/>

      {!image ? (
          <div className={`relative size-20 flex items-center justify-center ${shape == "c" ? "rounded-full" : "rounded-lg"} bg-purple-100`}>
            {Icon && <Icon className='text-4xl text-primary'/>}
            <button 
              type='button' 
              className={`absolute -right-1 -bottom-1 bg-purple-600 text-white size-8 flex items-center justify-center rounded-full ${isDisable ? "cursor-not-allowed dark:bg-slate-800" : "cursor-pointer hover:bg-purple-700 dark:bg-slate-800 dark:hover:bg-slate-700"}`} 
              onClick={handleChooseFile}
            >
              <LuUpload/>
            </button>
          </div>
        ) : (
          <div className='relative'>
            <img src={previewPictureUrl} alt="image profile" className={`size-20 ${shape == "c" ? "rounded-full" : "rounded-lg"} object-cover`}/>
            <button 
              type='button' 
              className='absolute -right-1 -bottom-1 bg-red-400 hover:bg-red-500 text-white size-8 flex items-center justify-center rounded-full cursor-pointer' 
              onClick={handleRemove}
            >
              <LuTrash/>
            </button>
          </div>
        )
      }
    </div>
  )
}

export default PictureSelect