import React, { useEffect } from "react";
import { BookService } from "../../service/BookService/book.service";
import { useParams } from "react-router-dom";
import { Table, Tabs } from "antd";
import generateColumns from "./columns";

import "./book.css";

const Book = ({}) => {
  const { book, fetchBook, bookLoading, issueBook, returnBook } = BookService();

  const { id } = useParams();

  const handleIssueBook = (member, type) =>
    (type === "requested" ? issueBook : returnBook)(id, member);

  const tabs = [
    {
      key: "1",
      label: "Request",
      children: (
        <Table
          rowKey="_id"
          columns={generateColumns(handleIssueBook, "requested", !book?.count)}
          loading={bookLoading}
          dataSource={book?.requested}
          pagination={{
            hideOnSinglePage: true,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Issued",
      children: (
        <Table
          rowKey="_id"
          columns={generateColumns(handleIssueBook, "issued")}
          loading={bookLoading}
          dataSource={book?.issuedTo}
          pagination={{
            hideOnSinglePage: true,
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchBook(id);
  }, [id]);

  return (
    <div className="book">
      {book && (
        <h1 className="m-0">
          {book?.title} by {book?.author}
        </h1>
      )}
      <Tabs items={tabs} />
    </div>
  );
};

export default Book;
