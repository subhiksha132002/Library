import React, { useContext, useEffect, useState } from "react";
import { BookService } from "../../service/BookService/book.service";
import { Drawer, Input, Modal, Space, Table } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import generateColumns from "./columns";
import BookForm from "./BookForm";
import debounce from "lodash.debounce";
import Search from "antd/es/input/Search";
import { generatePath, useNavigate } from "react-router";
import UserContext from "../../Context/UserContext";
import DeleteBook from "./DeleteBook";

import "./books.css";
import FileUpload from "../Book/FileUpload";

export const Books = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const { fetchBooks, books, loading, deleteBook, updateBooks, requestBook } =
    BookService();

  const [isBookFormVisible, setIsBookFormVisible] = useState(false);

  const [chosenBook, setChosenBook] = useState();

  const [chosenBookToDelete, setChosenBookToDelete] = useState();

  const [filters, setFilters] = useState();

  const isAdmin = user?.type === "admin";

  const handleBookRequest = async (book) => {
    const updatedBook = await requestBook(book?._id);
    updateBooks(updatedBook, "update");
  };

  const handleSearch = debounce(({ target: { value } }) => {
    setFilters({ title: value, author: value, edition: value });
  }, 200);

  const openBookForm = () => setIsBookFormVisible(true);

  const closeBookForm = () => {
    setIsBookFormVisible(false);
    setChosenBook(undefined);
  };

  const handleSubmit = (book) => {
    closeBookForm();
    updateBooks(book, chosenBook?._id ? "update" : "add");
  };

  const handleEdit = (book) => {
    setIsBookFormVisible(true);
    setChosenBook(book);
  };

  const handleDelete = (book) => {
    setChosenBookToDelete(book);
  };

  useEffect(() => {
    fetchBooks(filters);
  }, [filters]);

  return (
    <>
      <div className="books">
        <Space className="books__header">
          <h1 className="m-0">Books</h1>
          {isAdmin && <PlusCircleOutlined onClick={openBookForm} />}
          {/* <Button className="btn" type="primary">Upload</Button>
           */}
          {isAdmin && <FileUpload />}
        </Space>
        <Search
          className="books__search"
          placeholder="Search By Title, Author, Access Number"
          onChange={handleSearch}
        />
        <Table
          rowKey="_id"
          columns={generateColumns(
            handleEdit,
            setChosenBookToDelete,
            user,
            handleBookRequest
          )}
          loading={loading}
          dataSource={books}
          pagination={{
            hideOnSinglePage: true,
          }}
          rowClassName="cursor-pointer"
          onRow={(book) => ({
            onClick: () => {
              if (!isAdmin) return;

              const route = generatePath("/books/:id", { id: book?._id });
              navigate(route);
            },
          })}
        />
      </div>
      <Drawer
        destroyOnClose
        title={`${chosenBook?._id ? "Update" : "Add"} Book`}
        width={500}
        open={isBookFormVisible}
        onClose={closeBookForm}
      >
        <BookForm
          onCancel={closeBookForm}
          onSubmit={handleSubmit}
          book={chosenBook}
        />
      </Drawer>
      <Modal
        destroyOnClose
        open={!!chosenBookToDelete?._id}
        closable={false}
        footer={false}
      >
        <DeleteBook
          book={chosenBookToDelete}
          onDelete={deleteBook}
          onCancel={() => setChosenBookToDelete(undefined)}
        />
      </Modal>
    </>
  );
};
