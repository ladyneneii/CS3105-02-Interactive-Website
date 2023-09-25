import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CommentForm from "../components/comments/CommentForm";
import Comment from "../components/comments/Comment";
import CommentData, {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../api/comments_api";

// interface CommentData {
//   id: string;
//   body: string;
//   parentId: string | null;
//   createdAt: string;
//   username: string; // Add username
//   userId: string; // Add userId
// }
// this is already imported from the API

interface Props {
  commentsUrl: string;
  currentUserId: string;
}

const CommentsPage = ({ commentsUrl, currentUserId }: Props) => {
  const [backendComments, setBackendComments] = useState<CommentData[]>([]);
  const [activeComment, setActiveComment] = useState<{
    id: string;
    type: string;
  } | null>(null);

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
        <CommentForm submitLabel="Post" handleSubmit={addComment} />
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

export default CommentsPage;
