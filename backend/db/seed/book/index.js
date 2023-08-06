const books = require("./book.json");
const Book = require("../../../model/bookSchema");

const populateBooks = async () => {
  const mappedBooks = new Map();

  books.forEach(({ Book_name, Author, Access_no, Availability }) => {
    const existingBooks = mappedBooks.get(Book_name)?.count || 0;

    mappedBooks.set(Access_no, {
      title: Book_name,
      author: Author,
      edition: Access_no,
      count: existingBooks + Number(Availability === "YES"),
    });
  });

  const mutatedBooks = [];

  mappedBooks.forEach((book) => mutatedBooks.push(book));

  await Book.deleteMany({});
  await Book.insertMany(mutatedBooks);

  console.log("Books Populated");
};

module.exports = {
  populateBooks,
};
