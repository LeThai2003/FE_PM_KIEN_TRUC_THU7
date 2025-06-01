import React from 'react'
import Comment from './Comment';

const CommentList = ({commentsByParentId, parentId = undefined}) => {

  const comments = commentsByParentId[parentId] || [];

  // console.log(comments);

  return (
    <div>
      {comments?.map(comment => (
        <Comment key={comment._id} comment={comment} commentsByParentId={commentsByParentId}/>
      ))}
    </div>
  )
}

export default CommentList