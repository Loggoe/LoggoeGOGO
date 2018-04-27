import React from 'react';


const TeacherComments = (props) => (
  <div>
    {props.comments.map((comment) => {
      return (
        <div>
          <div>{comment.begRange} - {comment.endRange}</div>
          <div>{comment.comment}</div>
          <button onClick={() => {props.deleteComment(comment)}}>X</button>
        </div>
      )
    })}
  </div>
)


export default TeacherComments;