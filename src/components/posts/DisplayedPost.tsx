import React, { useEffect, useRef, useState } from "react";
import empty_pfp from "../../assets/img/empty-profile-picture-612x612.jpg";
import "../../styles/components/post.css";
import Button from "../Button";
import { getAllPosts } from "../../pages/PostsPage";
import { PostProps } from "../../pages/PostsPage";
import Post from "./Post";

interface DisplayedPostComponentProps {
  key: string;
  post_id: string;
  user_id: string;
  Username: string;
  PostContent: string;
  date_time: string;
  State: string;
  post_reply_id: string;
  post_reply_level: number;
  setAllPosts: React.Dispatch<React.SetStateAction<PostProps[]>>;
}

const DisplayedPost = ({
  post_id,
  user_id,
  Username,
  PostContent,
  date_time,
  State,
  post_reply_id,
  post_reply_level,
  setAllPosts,
}: DisplayedPostComponentProps) => {
  const user_details_str = localStorage.getItem("user_details");
  let logged_in_user_id = "-1";
  let logged_in_username = "";

  if (user_details_str) {
    logged_in_user_id = JSON.parse(user_details_str).user_id;
    logged_in_username = JSON.parse(user_details_str).Username;
  } else {
    console.error("user details not found in the local storage.");
  }

  const dateObject = new Date(date_time);
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = dateObject.toLocaleDateString(undefined, optionsDate);

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedTime = dateObject.toLocaleTimeString(undefined, optionsTime);

  const postRef = useRef<HTMLTextAreaElement | null>(null);
  const [postContent, setPostContent] = useState(PostContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState(PostContent);
  const replyRef = useRef<HTMLTextAreaElement | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [validReply, setValidReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const displayedReplyIndent = 0 + post_reply_level * 100;

  const handleEditPostPending = () => {
    setIsEditing(true);
    // Set focus and move cursor to the end of the text
    postRef.current?.focus();
    postRef.current?.setSelectionRange(
      editedPostContent.length,
      editedPostContent.length
    );
  };

  const handlePostEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPostContent(e.target.value);
  };

  const handleEditPostCancel = () => {
    setIsEditing(false);
    // preserve the postContent value
    if (postRef.current) {
      postRef.current.value = postContent;
    }
    setEditedPostContent(postContent);
  };

  const handleEditPostConfirm = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setIsEditing(false);
    // preserve the editedContent value
    if (postRef.current) {
      postRef.current.value = editedPostContent;
    }
    setPostContent(editedPostContent);

    const formData = new FormData();
    formData.append("post_id", post_id);
    formData.append("Content", editedPostContent);

    // update post content on the database
    try {
      const response = await fetch("http://localhost:3001/api/posts", {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        console.log("Successfully updated post on the database.");
      } else {
        console.error("Failed to update post on the database");

        return;
      }
    } catch (error) {
      console.error("Error during PATCH request:", error);

      return;
    }
  };

  const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("post_id", post_id);

    // remove post from the database
    try {
      const response = await fetch("http://localhost:3001/api/posts", {
        method: "DELETE",
        body: formData,
      });

      if (response.ok) {
        console.log("Successfully removed post from the database.");

        // reload all the posts excluding the deleted one
        getAllPosts().then((posts_json) => setAllPosts(posts_json));
      } else {
        console.error("Failed to delete post from the database");

        return;
      }
    } catch (error) {
      console.error("Error during DELETE request:", error);

      return;
    }
  };

  const handlePostReply = () => {
    setShowReplyForm(true);
    replyRef.current?.focus();
  };

  useEffect(() => {
    if (showReplyForm && replyRef.current) {
      replyRef.current.focus();
    }
  }, [showReplyForm]);

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReplyContent = e.target.value;
    setReplyContent(newReplyContent);
    setValidReply(newReplyContent.length === 0 ? false : true);
  };

  const handleReplySubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", logged_in_user_id);
    formData.append("Username", logged_in_username);
    formData.append("Content", replyContent);
    formData.append("date_time", new Date().toISOString());
    formData.append("post_reply_id", post_id);
    formData.append("post_reply_level", (post_reply_level + 1).toString());

    try {
      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Successfully added reply to the database.");

        getAllPosts().then((posts_json) => setAllPosts(posts_json));
        setShowReplyForm(false);
      } else {
        console.error("Failed to add reply to the database");

        return;
      }
    } catch (error) {
      console.error("Error during POST request:", error);

      return;
    }
  };

  return (
    <>
      <div
        className="container-md border rounded-4 shadow mb-3"
        style={{
          marginLeft: `calc(0px + ${displayedReplyIndent}px)`,
          width: "100%",
        }}
      >
        {State === "Visible" ? (
          <>
            <div className="user_details my-2">
              <img
                src={empty_pfp}
                alt="empty profile picture"
                className="rounded-circle empty_profile_picture_icon"
              />
              <div className="username_date-time">
                <p className="my-0 fw-semibold">{Username}</p>
                <span className="fw-normal">
                  {formattedDate} {formattedTime}
                </span>
              </div>
            </div>
            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                placeholder="What's on your mind?"
                value={isEditing ? editedPostContent : postContent}
                ref={postRef}
                onChange={handlePostEditChange}
                readOnly={!isEditing}
              ></textarea>
              <label htmlFor="post">What's on your mind?</label>
            </div>
            <div className="post_settings">
              <Button color="primary" onClick={handlePostReply}>
                Reply
              </Button>
              {parseInt(logged_in_user_id, 10) === parseInt(user_id, 10) && (
                <>
                  {!isEditing ? (
                    <>
                      <Button color="primary" onClick={handleEditPostPending}>
                        Edit
                      </Button>
                      <Button color="danger" onClick={handleDeletePost}>
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button color="primary" onClick={handleEditPostConfirm}>
                        Confirm Edit
                      </Button>
                      <Button color="secondary" onClick={handleEditPostCancel}>
                        Cancel
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        ) : State === "DeletedReply" ? (
          <p className="my-3 text-center fw-semibold">Deleted</p>
        ) : State === "HiddenReply" ? (
          <p>Hidden</p>
        ) : null}
      </div>
      {showReplyForm && (
        <Post
          postRef={replyRef}
          onChange={handleReplyChange}
          color="primary"
          onClick={handleReplySubmit}
          disabled={!validReply}
          replyMode={true}
          setShowReplyForm={setShowReplyForm}
          postReplyLevel={post_reply_level}
        >
          Confirm Reply
        </Post>
      )}
    </>
  );
};

export default DisplayedPost;
