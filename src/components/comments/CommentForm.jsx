import React, { useEffect, useRef, useState } from 'react'
import { LuImage, LuPaperclip, LuSend, LuSmile, LuX } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, replyComment, updateComment } from '../../redux/comments/commentSlice';
import EmojiPicker from 'emoji-picker-react';
import { uploadImages } from '../../utils/uploads/uploadImage';
import { socket } from '../../utils/socket/socket';

const CommentForm = ({parentId, type, initialValue, setOpen, imagesUrlUpdate}) => {

  const {id} = useParams();

  const dispatch = useDispatch();
  const {isDarkMode} = useSelector(state => state.globals);


  const [message, setMessage] = useState(initialValue);
  const [gallery, setGallery] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [file, setFile] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  // use ref
  const textareaRef = useRef(null);
  const divRef = useRef(null);  // emojipicker
  const iconRef = useRef(null);
  const inputImageRef = useRef(null);

  // config input textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if(textarea)
    {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`
      // textarea.selectionStart = textarea.selectionEnd = textarea.value.length; 
    }
  }, [message]);

  // focus mouse when update
  useEffect(() => {
    if(type == "update")
    {
      const textarea = textareaRef.current;
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }
  }, []);

  // post comment or update or reply
  const handleSubmit = async () => {
    // console.log(message);
    // console.log(gallery.length);
    // console.log(!message.trim() && gallery.length == 0);

    if(!message.trim() && gallery.length == 0) return;
    setIsLoading(true);
    if(type == "create" || type == "reply")
    {
      let imagesUrl;
      if(gallery.length > 0)
      {
        console.log("chay vo day");
        const data = await uploadImages(gallery);
        imagesUrl = data.imagesUrl || [];
        setGallery([]);
        setGalleryPreview([]);
      }

      try {
        const response = await axiosInstance.post(API_PATHS.COMMENT.CREATE(id), {
          message, parentId, imagesUrl
        });

        setMessage("");

        if(type == "reply")
        {
          setOpen(false);
          
        }

        setIsLoading(false);

      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
    else if(type == "update")
    {
      try {
        const response = await axiosInstance.patch(API_PATHS.COMMENT.UPDATE(parentId), {  // parentID --> id cua comment
          message, imagesUrl: imagesUrlUpdate
        });
        console.log(response.data);
        setMessage("");
        
        setIsLoading(false);
        setOpen(false)
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
    setOpenEmojiPicker(false);
  }

  // -----------------socket------------------------
  useEffect(() => {
    socket.on("SERVER_SEND_NEW_COMMENT", (data) => {
      // console.log("-------------new----------", data);
      dispatch(addComment(data.comment));
    });
    
    socket.on("SERVER_SEND_REP_COMMENT", (data) => {
      // console.log("-------------rep----------", data);
      dispatch(replyComment(data.comment));
    });

    socket.on("SERVER_SEND_UPDATE_COMMENT", (data) => {
      console.log(data);
      dispatch(updateComment(data.comment));
    });

    return () => {
      socket.off("SERVER_SEND_NEW_COMMENT");
      socket.off("SERVER_SEND_REP_COMMENT");
    };
  }, []);
  // -----------------end socket---------------------

  // click icon
  const onClickEmoji = (e) => {
    e?.preventDefault?.();

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const emoji = e.emoji;

    // const newMessage = message.substring(0, start) + emoji + message.substring(end);

    setMessage(prev => prev.substring(0, start) + emoji + prev.substring(end));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 100);
  }

  useEffect(() => {
    if (!openEmojiPicker) {
      textareaRef.current?.focus();
    }
  }, [openEmojiPicker]);


  // handle click out to close div emoji
  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && iconRef.current && textareaRef.current && !textareaRef.current.contains(event.target) && !divRef.current.contains(event.target) && !iconRef.current.contains(event.target)) {
        setOpenEmojiPicker(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // handle images
  const handleChooseImages = () => {
    inputImageRef.current.click();
  }

  const handleChangeGallerry = (e) => {
    // console.log(e.target.files);
    let files = Array.from(e.target.files);
    files = files.slice(0,5);
    setGallery(files);

    let arrTempPreview = [];
    for (const file of files) {
      const object = {
        src: URL.createObjectURL(file),
        lastModified: file.lastModified
      }
      arrTempPreview.push(object);
    }
    setGalleryPreview(arrTempPreview);
  }

  // console.log(gallery);
  // console.log(galleryPreview);

  const handleRemoveImage = (e) => {
    setGalleryPreview(prev => prev.filter(item => item.src != e.src));
    setGallery(prev => prev.filter(file => file.lastModified != e.lastModified));
  }

  return (
    <div className="relative bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm w-full  border border-gray-100 dark:border-gray-600">
      {/* emoji picker */}
      <div className='mb-1 absolute bottom-24 left-4' ref={divRef}>
        <EmojiPicker theme={isDarkMode ? "dark" : "light"} autoFocusSearch={false} onEmojiClick={onClickEmoji} width={300} height={350} open={openEmojiPicker}/>
      </div>

      <input ref={inputImageRef} type="file" accept="image/*" multiple className='hidden' onChange={handleChangeGallerry}/>

      {/* review image */}
      {
        galleryPreview.length > 0 && 
        <div className="mb-4">
          <label className="block font-medium">Images (max 5):</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {galleryPreview.map((item, idx) => (
              <div className='relative' key={item.lastModified + idx}>
                <div 
                  className='absolute -top-1 -right-1 text-white size-5 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-500 cursor-pointer'
                  onClick={() => handleRemoveImage(item)}
                >
                  <LuX/>
                </div>
                <img key={idx} src={item.src} alt={`Gallery preview ${idx}`} className="w-24 h-24 object-cover border rounded" />
              </div>
            ))}
          </div>
        </div>
      }


      {/* form input comment */}
      <textarea 
        type="text" 
        rows={1}
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className='w-full resize-none overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 text-sm text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500'
        autoFocus
        placeholder='Comment...'
      />
      <div className='flex items-center justify-between mt-1'>
        <div className='flex items-center justify-start gap-3 text-gray-400 dark:text-gray-300'>
          <div ref={iconRef} onClick={() => setOpenEmojiPicker(prev => !prev)}>
            <LuSmile className="size-5 cursor-pointer hover:text-yellow-500"/>
          </div>
          {type != "update" && 
            <>
              <LuImage className="size-5 cursor-pointer hover:text-blue-500" onClick={handleChooseImages}/>
              <LuPaperclip className="size-5 cursor-pointer hover:text-green-500" />
            </>
          }
        </div>
        <button
          disabled={(!message.trim() && gallery.length == 0) || isLoading}
          className={`uppercase flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-full text-white ${(message.trim() || gallery.length > 0 ) ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"}`}
          onClick={handleSubmit}
        >
          <LuSend className='size-4'/>
          {isLoading ? ((type == "create" || type == "reply") ?  "Posting" : "updating") : ((type == "create" || type == "reply") ? "POST" : "Update")}
        </button>
      </div>
      
    </div>
  )
}

export default CommentForm