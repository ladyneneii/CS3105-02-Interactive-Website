import React, { useEffect, useState } from "react";
import { ButtonProps } from "../Button";
import Button from "../Button";

interface PostComponentProps extends ButtonProps {
  postRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  replyMode: boolean;
  setShowReplyForm?: React.Dispatch<React.SetStateAction<boolean>>;
  postReplyLevel: number;
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
  postReplyLevel,
}: PostComponentProps) => {
  const replyIndent = postReplyLevel === 0 ? 65 : replyMode ? 115 : 0;
  console.log(replyIndent);

  const handleReplyCancel = () => {
    if (setShowReplyForm) {
      setShowReplyForm(false);
    }
  };

  return (
    <>
      <div
        style={{
          marginLeft: `${replyIndent}px`,
          width: "100%",
        }}
      >
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
