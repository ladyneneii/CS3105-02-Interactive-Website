import React, { useRef, useState } from "react";
import empty_pfp from "../../assets/img/empty-profile-picture-612x612.jpg";
import "../../styles/components/post.css";
import Button from "../Button";

interface DisplayedPostComponentProps {
  key: string;
  post_id: string;
  Username: string;
  PostContent: string;
  date_time: string;
}

const DisplayedPost = ({
  post_id,
  Username,
  PostContent,
  date_time,
}: DisplayedPostComponentProps) => {
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

    const formData = new FormData()
    formData.append("post_id", post_id)
    formData.append("Content", editedPostContent)

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

  return (
    <>
      <div className="container-md border rounded-4 shadow mb-3">
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
          {!isEditing ? (
            <Button color="primary" onClick={handleEditPostPending}>
              Edit
            </Button>
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
        </div>
      </div>
    </>
  );
};

export default DisplayedPost;
