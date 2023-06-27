require("./db");

const cors = require("cors");

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const membersRoute = require("./routes/members");

const booksRoute = require("./routes/books");

const authRoute = require("./routes/auth");

const authenticate = require("./middleware/authenticate");

app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});

app.use("/auth", authRoute);

app.use(authenticate);

app.use("/members", membersRoute);

app.use("/books", booksRoute);
