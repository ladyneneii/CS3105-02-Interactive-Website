import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../api";
import Navbar from "../components/Navbar";

interface CommentData {
  id: string;
  body: string;
  parentId: string | null;
  createdAt: string;
  username: string; // Add username
  userId: string;   // Add userId
}

interface CommentsProps {
  commentsUrl: string;
  currentUserId: string;
  
}

const Comments: React.FC<CommentsProps> = ({ commentsUrl, currentUserId }) => {
  const [backendComments, setBackendComments] = useState<CommentData[]>([]);
  const [activeComment, setActiveComment] = useState<{ id: string; type: string } | null>(
    null
  );

  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  const getReplies = (commentId: string) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const addComment = (text: string, parentId: string | null) => {
        createCommentApi(text, parentId).then((comment) => {
          setBackendComments([comment, ...backendComments]);
          setActiveComment(null);
        });
      };

  const updateComment = (text: string, commentId: string) => {
    updateCommentApi(text).then(() => {
      const updatedBackendComments = backendComments.map((backendComment) => {
        if (backendComment.id === commentId) {
          return { ...backendComment, body: text };
        }
        return backendComment;
      });
      setBackendComments(updatedBackendComments);
      setActiveComment(null);
    });
  };

  const deleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      deleteCommentApi().then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };

  useEffect(() => {
    getCommentsApi().then((data: CommentData[]) => {
      setBackendComments(data);
    });
  }, []);

  return (
    <>
    <Navbar></Navbar>
    <div className="comments">
      <h3 className="comments-title">Free Zone</h3>
      <div className="comment-form-title">What's on your mind?</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default Comments;
