const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  id: { type: mongoose.Schema.Types.ObjectId },
  name: String,
  phone: { type: String, unique: true, required: true },
  registerNumber: { type: String, unique: true, required: true },
  type: { type: String, enum: ["staff", "student", "admin"] },
  password: {
    type: String,
    default: "Password@123",
  },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
