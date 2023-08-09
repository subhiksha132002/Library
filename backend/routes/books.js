const express = require("express");

const multer = require("multer");
const csvParser = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");

const router = express.Router();

const Book = require("../model/bookSchema");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    const fieldsToSearch = ["title", "author", "edition"].map((search) => ({
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

router.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const results = [];

  // Determine the file type (CSV or XLSX)
  const isCSV = req.file.mimetype === "text/csv";
  let worksheet;
  let responseSent = false; // Initialize responseSent variable
  let newData; // Declare newData variable outside saveDataToMongoDB function
  if (isCSV) {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        newData = results.map((item) => {
          // Remove any unwanted fields or extra data from the table
          // and ensure it matches the schema
          return {
            author: item.Author,
            count:
              item.Availability === "YES" || item.Availability === "Yes"
                ? 1
                : 0,
            edition: item.Access_no,
            title: item.Book_name,
          };
        });
        saveDataToMongoDB(newData); // Pass newData to saveDataToMongoDB function
      });
  } else {
    try {
      // Read the XLSX file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[sheetName];
    } catch (err) {
      console.error("Error reading XLSX file:", err);
      return res.status(500).json({ error: "Failed to read XLSX file" });
    }

    // Convert XLSX data to an array of objects
    const data = xlsx.utils.sheet_to_json(worksheet);
    newData = data.map((item) => {
      // Remove any unwanted fields or extra data from the table
      // and ensure it matches the schema
      return {
        author: item.Author,
        count:
          item.Availability === "YES" || item.Availability === "Yes" ? 1 : 0,
        edition: item.Access_no,
        title: item.book_name,
      };
    });
    saveDataToMongoDB(newData); // Pass newData to saveDataToMongoDB function
  }

  async function saveDataToMongoDB(data) {
    // ... (Existing code)

    try {
      const newItems = [];

      for (const item of newData) {
        const existingItem = await Book.findOne({ edition: item.edition });

        if (!existingItem) {
          newItems.push(item);
        } else {
          // If the item exists, update the count based on Availability
          existingItem.count += item.count;
          await existingItem.save();
        }
      }

      if (newItems.length > 0) {
        // Save only the new data to MongoDB using bulkWrite
        await Book.bulkWrite(
          newItems.map((item) => ({
            insertOne: {
              document: item,
            },
          }))
        );
      }

      // Send the response only once after all data processing is done
      if (!responseSent) {
        responseSent = true;
        res.json({ message: "File data uploaded successfully" });
      }
    } catch (err) {
      console.error("Error saving data to MongoDB:", err);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: "Failed to save data to MongoDB" });
      }
    } finally {
      // Optional: Remove the uploaded file from the server after processing
      fs.unlinkSync(filePath);
    }
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
