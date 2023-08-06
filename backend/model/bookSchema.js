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

const deleteSchema = mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  reason: String,
  deletedAt: { type: Date, default: new Date() },
});

const bookSchema = new mongoose.Schema({
  author: { type: String },
  count: { type: Number },
  edition: { type: String },
  id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  issuedTo: [issuedToSchema],
  requested: [requestedBookSchema],
  deleteReason: { type: deleteSchema, default: null },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
