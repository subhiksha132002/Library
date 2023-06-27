const express = require("express");

const router = express.Router();

const Member = require("../model/memberSchema");

router.get("/", async (req, res) => {
  try {
    const type = req.query.type;

    const query = type ? { type } : {};

    const members = await Member.find(query);

    res.json(members);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

router.post("/", async (req, res) => {
  try {
    const member = new Member(req.body.member);
    await member.save();
    res.status(201).json(member);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body.member,
      {
        new: true,
      }
    );
    if (!updatedMember) return res.status(404).send("Member not found");

    res.json(updatedMember);
  } catch (ex) {
    console.log(ex);
    res.status(500).send(ex);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

    if (!deletedMember) return res.status(404).send("Member not found");

    res.status(204).send(deletedMember);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

module.exports = router;
