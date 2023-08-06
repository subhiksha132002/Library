const express = require("express");

const router = express.Router();

const Book = require("../model/bookSchema");

router.get("/", async (req, res) => {
  try {
    const fieldsToSearch = ["title", "author"].map((search) => ({
      [search]: {
        $regex: new RegExp(req.query[search] || ""),
        $options: "i",
      },
    }));

    const books = await Book.find({
      $or: fieldsToSearch,
      deleteReason: { [!!req?.query?.isDeletedBooks ? "$ne" : "$eq"]: null },
    })
      .populate(["issuedTo.member", "requested.member", "deleteReason.member"])
      .sort({ "requested.requestedOn": -1, title: 1 });

    res.status(200).json(books);
  } catch (ex) {
    console.log(ex);
    res.status(500).send(ex);
  }
});

router.get("/:id", async ({ params: { id } }, res) => {
  try {
    const book = await Book.findById(id).populate([
      "issuedTo.member",
      "requested.member",
    ]);

    if (!book)
      return res.status(404).json({
        message: "Requested Book is not found",
      });

    res.status(200).json(book);
  } catch (ex) {
    res.status(500).json({
      message: ex,
    });
  }
});

router.put("/:id/request", async ({ body: { user }, params: { id } }, res) => {
  try {
    const memberId = user?._id;

    if (!memberId) throw new Error("Unable to get user ID");

    const book = await Book.findById(id).populate([
      "issuedTo.member",
      "requested.member",
    ]);

    const isBookAlreadyIssued = book.issuedTo?.some(
      (issue) => issue?.member?._id?.toString() === memberId
    );

    if (isBookAlreadyIssued)
      throw new Error("Book already issued to this member");

    book.requested = [...book.requested, { member: memberId }];

    await book.populate("requested.member");

    await book.save();

    res.status(200).json(book);
  } catch (ex) {
    console.error(ex);
    res.status(500).json({
      message: ex,
    });
  }
});

router.put("/:id/issue", async ({ body: { member }, params: { id } }, res) => {
  try {
    const memberId = member?._id;

    if (!memberId) throw new Error("Unable to get user ID");

    const book = await Book.findById(id).populate(["issuedTo.member"]);

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (!book.count)
      return res.status(400).json({ message: "Currently Book is unavailable" });

    const isBookAlreadyIssued = book.issuedTo?.some(
      (issue) => issue?.member?._id?.toString() === memberId
    );

    if (isBookAlreadyIssued)
      throw new Error("Book already issued to this member");

    book.requested = book.requested?.filter(
      (request) => request?.member?._id?.toString() !== memberId
    );

    book.issuedTo = [...book.issuedTo, { member: memberId }];

    book.count = book.count - 1;

    await book.populate(["issuedTo.member", "requested.member"]);

    await book.save();

    res.status(200).json(book);
  } catch (ex) {
    console.error(ex);
    res.status(500).json({
      message: ex,
    });
  }
});

router.put("/:id/return", async ({ body: { member }, params: { id } }, res) => {
  try {
    const memberId = member?._id;

    if (!memberId) throw new Error("Unable to get user ID");

    const book = await Book.findById(id).populate([
      "issuedTo.member",
      "requested.member",
    ]);

    if (!book) return res.status(404).json({ message: "Book not found" });

    book.requested = book.requested?.filter(
      (request) => request?.member?._id?.toString() !== memberId
    );

    book.issuedTo = book.issuedTo?.filter(
      (issued) => issued?.member?._id?.toString() !== memberId
    );

    book.count = book.count + 1;

    await book.save();

    res.status(200).json(book);
  } catch (ex) {
    console.error(ex);
    res.status(500).json({
      message: ex,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body.book);

    await book.save();

    res.status(201).json(book);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body.book,
      {
        new: true,
      }
    );
    if (!updatedBook) return res.status(404).send("Book not found");

    res.json(updatedBook);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) return res.status(404).send("Book not found");

    res.status(204).send(deletedBook);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

module.exports = router;
