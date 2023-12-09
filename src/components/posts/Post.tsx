import React from 'react'
import { ButtonProps } from '../Button';
import Button from '../Button';

interface PostProps extends ButtonProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Post = ({onChange, color, onClick, disabled, children}: PostProps) => {
  return (
    <>
      <div className="form-floating mb-3">
        <textarea
          className="form-control"
          placeholder="What's on your mind?"
        //   ref={postRef}
          onChange={onChange}
          id="post"
        ></textarea>
        <label htmlFor="post">What's on your mind?</label>
      </div>
      <Button color={color} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    </>
  );
}

export default Post