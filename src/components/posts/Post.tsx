import React, { useEffect, useState } from "react";
import { ButtonProps } from "../Button";
import Button from "../Button";

interface PostComponentProps extends ButtonProps {
  postRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  replyMode: boolean;
  setShowReplyForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Post = ({
  postRef,
  onChange,
  color,
  onClick,
  disabled,
  children,
  replyMode,
  setShowReplyForm,
}: PostComponentProps) => {
  const replyIndent = !replyMode ? 0 : 100

  const handleReplyCancel = () => {
    if (setShowReplyForm) {
      setShowReplyForm(false);
    }
  };

  return (
    <>
      <div style={{ marginLeft: `calc(0px + ${replyIndent}px)`, width: "100%" }}>
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
        {replyMode && (
          <Button
            color="secondary"
            onClick={handleReplyCancel}
            disabled={false}
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
};

export default Post;
