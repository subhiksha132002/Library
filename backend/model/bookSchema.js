const mongoose = require("mongoose");

const issuedToSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  issuedOn: {
    type: Date,
    default: Date.now(),
  },
});

const requestedBookSchema = mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  requestedOn: {
    type: Date,
    default: Date.now(),
  },
});

const bookSchema = new mongoose.Schema({
  author: { type: String },
  count: { type: Number },
  edition: { type: String },
  id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  issuedTo: [issuedToSchema],
  requested: [requestedBookSchema],
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
