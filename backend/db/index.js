const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/library", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((ex) => console.error("Error connecting MongoDB"));
