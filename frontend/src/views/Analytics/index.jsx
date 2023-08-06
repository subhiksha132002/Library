import React, { useEffect } from "react";
import { Table } from "antd";
import { BookService } from "../../service/BookService/book.service";
import moment from "moment";

const Analytics = () => {
  const { fetchBooks, loading, books } = BookService();

  useEffect(() => {
    fetchBooks({ isDeletedBooks: true });
  }, []);

  return (
    <div className="analytics">
      <h1>Deleted Books</h1>
      <Table
        rowKey="_id"
        columns={[
          {
            title: "Access No",
            dataIndex: "edition",
            align: "center",
          },
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Author",
            dataIndex: "author",
          },
          {
            title: "Delete Reason",
            dataIndex: ["deleteReason", "reason"],
          },
          {
            title: "Deleted By",
            dataIndex: ["deleteReason", "member", "name"],
          },
          {
            title: "Deleted At",
            dataIndex: ["deleteReason", "deletedAt"],
            render: (deletedAt) => moment(deletedAt).format("DD-MM-YYYY"),
          },
        ]}
        loading={loading}
        dataSource={books}
        pagination={{
          hideOnSinglePage: true,
        }}
        rowClassName="cursor-pointer"
      />
    </div>
  );
};

export default Analytics;
