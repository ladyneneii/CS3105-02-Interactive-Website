import React, { useEffect, useState } from "react";
import { ButtonProps } from "../Button";
import Button from "../Button";

interface PostComponentProps extends ButtonProps {
  postRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Post = ({
  postRef,
  onChange,
  color,
  onClick,
  disabled,
  children,
}: PostComponentProps) => {
  return (
    <>
      <div className="form-floating mb-3">
        <textarea
          className="form-control"
          placeholder="What's on your mind?"
          ref={postRef}
          onChange={onChange}
        ></textarea>
        <label htmlFor="post">What's on your mind?</label>
      </div>
      <Button color={color} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    </>
  );
};

export default Post;
