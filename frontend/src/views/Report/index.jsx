import React, { useEffect } from "react";
import { BookService } from "../../service/BookService/book.service";
import { Button, Table } from "antd";
import moment from "moment";

import "./report.css";
import { PrinterOutlined } from "@ant-design/icons";

const Report = ({}) => {
  const { fetchBooks, books, loading } = BookService();

  const flattenBooks = books.flatMap((book) =>
    book?.issuedTo
      ?.filter((issued) => moment(issued?.issuedOn).isSame(moment(), "week"))
      ?.map((issued) => ({ ...book, issued }))
  );

  const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="report">
      <div className="report__header">
        <h1>
          Issued Books ({moment().startOf("w").format("DD-MMM-YYYY")} to{" "}
          {moment().endOf("w").format("DD-MMM-YYYY")})
        </h1>
        <Button type="primary" onClick={handlePrint}>
          <PrinterOutlined />
          Print
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={flattenBooks}
        columns={[
          {
            title: "Book Title",
            dataIndex: "title",
          },
          {
            title: "Author",
            dataIndex: "author",
          },
          {
            title: "Edition",
            dataIndex: "edition",
          },
          {
            title: "Issue To",
            dataIndex: ["issued", "member", "name"],
          },
          {
            title: "Issue On",
            dataIndex: ["issued", "issuedOn"],
            render: (date) => moment(date).format("DD-MMM-YYYY"),
          },
        ]}
        pagination={false}
      />
    </div>
  );
};

export default Report;
