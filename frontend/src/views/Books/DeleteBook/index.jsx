import React, { useContext, useState } from "react";
import { Button, Input } from "antd";
import UserContext from "../../../Context/UserContext";

import "./deleteBook.css";

const DeleteBook = ({ onCancel, book, onDelete }) => {
  const [deleteReason, setDeleteReason] = useState("");

  const { user } = useContext(UserContext);

  const handleDelete = async () => {
    await onDelete?.({
      ...book,
      deleteReason: {
        reason: deleteReason,
        member: user?._id,
      },
    });
    onCancel?.();
  };

  return (
    <div className="delete-book">
      <span className="delete-book__title">
        Are you sure. You want to delete {book.title}?
      </span>
      <Input.TextArea
        placeholder="Delete Reason"
        onChange={(e) => setDeleteReason(e?.currentTarget?.value)}
        rows={4}
      />

      <div className="delete-book__buttons">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" disabled={!deleteReason} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteBook;
