import React, { useState } from "react";

interface Props {
  handleSubmit: (text: string, parentId: string | null) => void;
  submitLabel: string;
  hasCancelButton?: boolean;
  handleCancel?: () => void;
  initialText?: string;
}

const CommentForm = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",
}: Props) => {
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text.length === 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(text, null); // Pass null as parentId when no parentId is provided
    setText("");
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="comment-form-button" disabled={isTextareaDisabled}>
        {submitLabel}
      </button>
      {hasCancelButton && (
        <button
          type="button"
          className="comment-form-button comment-form-cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CommentForm;
