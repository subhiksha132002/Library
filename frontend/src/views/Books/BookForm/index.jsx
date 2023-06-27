import React from "react";
import { BookService } from "../../../service/BookService/book.service";
import { Form, Formik } from "formik";
import validationSchema from "./bookForm.validation";
import Input from "../../../shared/Input";
import { Button } from "antd";

import "./bookForm.css";

const BookForm = ({ onSubmit, book = {}, onCancel }) => {
  const { addBook, updateBook } = BookService();

  const handleSubmit = async (book) => {
    const newBook = await (book._id ? updateBook : addBook)(book);
    if (newBook) onSubmit?.(newBook);
  };
  return (
    <div className="book-form">
      <Formik
        initialValues={book}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="member-form">
            <Input name="title" label="Title" />
            <Input name="author" label="Author" />
            <Input name="edition" label="Edition" />
            <Input name="count" label="Availability" type="number" />
            <div className="member-form__footer">
              <Button htmlType="reset" onClick={onCancel}>
                Cancel
              </Button>
              <Button htmlType="submit" type="primary" loading={isSubmitting}>
                {book?._id ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookForm;
