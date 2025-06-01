import React, { useState } from 'react'
import CommentList from './CommentList'
import moment from 'moment'
import { getNameInitials } from '../../utils/helper'
import { FaEdit } from "react-icons/fa";
import { LuHeart, LuTrash2, LuX } from 'react-icons/lu'
import { FaReply } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import CommentForm from './CommentForm';
import Modal from '../Modal';
import DeleteAlert from '../DeleteAlert';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { deleteComment, updateLike } from '../../redux/comments/commentSlice';
import { GoHeartFill } from "react-icons/go";
import { socket } from '../../utils/socket/socket';
import { useEffect } from 'react';


const Comment = ({comment, commentsByParentId}) => {

  const dispatch = useDispatch();

  const dateFormat = moment(comment.createdAt).format("DD-MM-yyyy HH:mm:ss");

  const {currentUser} = useSelector(state => state.users);

  const childComments = commentsByParentId[comment._id];

  const [areChildrenHidden, setAreChildrenHidden] = useState(true);

  const [imagesUrl, setImagesUrl] = useState(comment.imagesUrl || []);

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(API_PATHS.COMMENT.DELETE(comment._id));
    } catch (error) {
      console.log(error);
    }
    setIsOpenDeleteAlert(false);
  }

  const handleUpdateLike = async () => {
    try {
      // console.log(comment._id)
      const response = await axiosInstance.patch(API_PATHS.COMMENT.LIKE(comment._id));
      // console.log(comment._id, " ", currentUser._id);
      dispatch(updateLike({_id: comment._id, userId: currentUser._id}));
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemoveImage = (src) => {
    // console.log(src);
    // console.log(imagesUrl);
    setImagesUrl(prev => prev.filter(item => item != src));
  }


  // -----------------socket------------------------
  useEffect(() => {
    socket.on("SERVER_DELETE_COMMENT", (data) => {
      // console.log(data);
      dispatch(deleteComment(data.commentId));
    });

    socket.on("SERVER_UPDATE_LIKE_COMMENT", (data) => {
      console.log(data.commentId, " ", data.userId);
      dispatch(updateLike({_id: data.commentId, userId: data.userId}));
    });

    return () => {
      socket.off("SERVER_UPDATE_LIKE_COMMENT");
    };
  }, []);
  // -----------------end socket---------------------

  return (
    <div className=''>

      <Modal
        isOpen={isOpenDeleteAlert}
        onClose={() => setIsOpenDeleteAlert(false)}
        title="Delete A Comment"
      >
        <DeleteAlert 
          content={<>Are you sure you want to delete the comment?</>}
          onDelete={handleDelete}
        />
      </Modal>

      <div className='flex flex-col border border-gray-200 mb-2 dark:border-gray-600 rounded-md px-4 py-2'>
        {/* header */}
        <div className='flex gap-2 items-center'>
          {
            comment.userId.profilePicture ? 
              <div className='w-fit border border-gray-200 rounded-full'>
                <img
                  src={comment.userId.profilePicture}
                  alt='image assignee'
                  width={30}
                  height={30}
                  className='size-8 rounded-full object-cover dark:border-dark-secondary'
                />
              </div>
              :
              <div className='size-8 text-sm font-medium text-green-800 dark:text-gray-200 bg-green-50 dark:bg-slate-700 rounded-full flex items-center justify-center border border-green-200 dark:border-gray-200'>
                {getNameInitials(comment.userId.fullname)}  
              </div>
          }  
          <div >
            <p className='text-sm font-medium'>{comment.userId.fullname}</p>
            <p className='text-xs text-slate-500 dark:text-slate-300'>{dateFormat}</p>
          </div>
        </div>

        {/* images */}
        {imagesUrl?.length > 0 && 
          <div className="flex flex-wrap gap-2 mt-2 ml-10">
            {imagesUrl.map((src, idx) => (
              <div className='relative' key={src}>
                {isEditing && 
                  <div 
                    className='absolute -top-1 -right-1 text-white size-5 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-500 cursor-pointer'
                    onClick={() => handleRemoveImage(src)}
                  >
                    <LuX/>
                  </div>
                }
                <img key={src} src={src} alt={`Gallery preview ${idx}`} className="w-24 h-24 object-cover border rounded" />
              </div>
            ))}
          </div>
        }

        {/* message */}
        {isEditing ? (
          <div className='my-2'>
            <CommentForm 
              parentId={comment._id}
              type="update"
              initialValue={comment.message}
              setOpen={setIsEditing}
              imagesUrlUpdate={imagesUrl}
            />
          </div>
        ) : (
          <div className="ml-10 text-md text-gray-800 dark:text-gray-200 tracking-[0.2px] my-1">{comment.message}</div>
        )}
        

        {/* footer */}
        <div className={`${isEditing ? "" : "ml-10"} flex items-center justify-start gap-3 text-gray-400 dark:text-gray-400 mt-1`}>

          {comment.like?.includes(currentUser._id) ? (
            <div className='flex items-center justify-center gap-1'>
              <GoHeartFill onClick={handleUpdateLike} className="size-[15px] cursor-pointer text-[#ff0000] hover:text-opacity-80" />
              <span className='text-xs'>{comment.like?.length || 0}</span>
            </div>
          ) : (
            <div className='flex items-center justify-center gap-1'>
              <LuHeart onClick={handleUpdateLike} className="size-[15px] cursor-pointer hover:text-gray-300 dark:hover:text-gray-200" />
              <span className='text-xs'>{comment.like?.length || 0}</span>
            </div>
          )}
          

          <div className='relative' onClick={() => setIsReplying(prev => !prev)}>
            <FaReply className={`size-[15px] cursor-pointer dark:hover:text-gray-200 ${isReplying ? "text-red-300" : "hover:text-gray-300"}`}/>
            {isReplying && <div className='absolute -bottom-1 -right-0.5 cursor-pointer hover:bg-red-500 bg-red-400 text-white size-3 rounded-full flex items-center justify-center'><LuX className='size-2 '/></div>}
          </div>

          {
            currentUser._id == comment.userId._id &&
            <>
              <div className='relative' onClick={() => setIsEditing(prev => !prev)}>
                <FaEdit className={`size-[15px] cursor-pointer dark:hover:text-gray-200 ${isEditing ? "text-red-300" : "hover:text-gray-300"}`}/>
                {isEditing && <div className='absolute -bottom-1 -right-0.5 cursor-pointer hover:bg-red-500 bg-red-400 text-white size-3 rounded-full flex items-center justify-center'><LuX className='size-2 '/></div>}
              </div>
              <LuTrash2 onClick={() => setIsOpenDeleteAlert(true)} className="size-[15px] cursor-pointer text-red-500 hover:text-red-400" />
            </>
          }
        </div>
      </div>

      {
        childComments?.length > 0 && (
          <div className=''>
            <div className={`${areChildrenHidden ? "hidden" : ""} flex items-stretch`}>

              <button
                className={`relative border-none p-0 w-[25px] mb-2 cursor-pointer outline-none -translate-x-[50%] 
                  before:absolute before:content-[""] before:top-0 before:bottom-0 before:left-[50%] before:w-[1px] before:bg-slate-400
                  before:hover:bg-slate-500 before:hover:w-[1.5px] dark:before:hover:bg-slate-300 before:transition before:duration-75
                `}
                onClick={() => setAreChildrenHidden(true)}
              />

              <div className='flex-1'>
                <CommentList 
                  commentsByParentId={commentsByParentId} 
                  parentId={comment._id}
                />
              </div>
            </div>

            {areChildrenHidden && (
              <button
                className="mb-3 px-4 py-1.5 text-white text-sm font-medium rounded-full bg-blue-600"
                onClick={() => setAreChildrenHidden(false)}
              >
                Show Replies
              </button>
            )}

          </div>
        )
      }

      {
        isReplying && 
        <div className='my-2 ml-[25px]'>
          <CommentForm 
            parentId={comment._id}
            type="reply"
            initialValue=""
            setOpen={setIsReplying}
          />
        </div>
      }

    </div>
  )
}

export default Comment