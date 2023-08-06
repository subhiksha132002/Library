import { useState } from "react";

import { axiosInstance } from "../../axiosInstance";

import { ApiRoutes } from "../../routes/apiRoutes";
import { generatePath } from "react-router";

export const BookService = () => {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [book, setBook] = useState();

  const [bookLoading, setBookLoading] = useState(false);

  const fetchBooks = async (params) => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(ApiRoutes.BOOKS, {
        params,
      });

      setBooks(data);
    } catch (ex) {
    } finally {
      setLoading(false);
    }
  };

  const fetchBook = async (id) => {
    try {
      setBookLoading(true);

      const { data } = await axiosInstance.get(`${ApiRoutes.BOOKS}/${id}`);

      setBook(data);
    } finally {
      setBookLoading(false);
    }
  };

  const addBook = async (book) => {
    try {
      setBookLoading(true);

      const { data } = await axiosInstance.post(ApiRoutes.BOOKS, { book });

      setBooks((books) => [...books, data]);

      setBook(data);

      return data;
    } catch (ex) {
    } finally {
      setBookLoading(false);
    }
  };

  const requestBook = async (bookId) => {
    try {
      setBookLoading(true);

      const ENDPOINT = generatePath(ApiRoutes.REQUEST_BOOK, {
        id: bookId,
      });

      const { data } = await axiosInstance.put(ENDPOINT);

      setBook(data);

      return data;
    } catch (ex) {
    } finally {
      setBookLoading(false);
    }
  };

  const issueBook = async (bookId, member) => {
    try {
      setBookLoading(true);

      const ENDPOINT = generatePath(ApiRoutes.ISSUE_BOOK, {
        id: bookId,
      });

      const { data } = await axiosInstance.put(ENDPOINT, member);

      setBook(data);

      return data;
    } catch (ex) {
    } finally {
      setBookLoading(false);
    }
  };

  const returnBook = async (bookId, member) => {
    try {
      setBookLoading(true);

      const ENDPOINT = generatePath(ApiRoutes.RETURN_BOOK, {
        id: bookId,
      });

      const { data } = await axiosInstance.put(ENDPOINT, member);

      setBook(data);

      return data;
    } catch (ex) {
    } finally {
      setBookLoading(false);
    }
  };

  const updateBook = async (book) => {
    try {
      setBookLoading(true);

      const { data } = await axiosInstance.put(
        `${ApiRoutes.BOOKS}/${book?._id}`,
        { book }
      );

      setBooks((books) =>
        books?.map((existingBook) =>
          existingBook?._id === book?._id ? data : existingBook
        )
      );
      setBook(data);
      return data;
    } catch (ex) {
    } finally {
      setBookLoading(false);
    }
  };

  const deleteBook = async (book) => {
    try {
      setBookLoading(true);

      await axiosInstance.put(`${ApiRoutes.BOOKS}/${book?._id}`, { book });

      setBooks((books) =>
        books?.filter((existingBook) => existingBook?._id !== book?._id)
      );
      setBook(undefined);
    } catch (ex) {
    } finally {
      setBookLoading(false);
    }
  };

  const updateBooks = (book, type = "add") => {
    setBooks((books) =>
      type === "add"
        ? [...books, book]
        : books?.map((existingBook) =>
            existingBook?._id === book?._id ? book : existingBook
          )
    );
  };

  return {
    addBook,
    book,
    bookLoading,
    books,
    deleteBook,
    fetchBooks,
    fetchBook,
    loading,
    updateBook,
    updateBooks,
    requestBook,
    returnBook,
    issueBook,
  };
};
