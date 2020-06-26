const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const helpers = require("./helpers");
app.use(morgan("dev"));
const ALLOWED_ORIGIN = "http://localhost:3000";

// APP ROUTES START
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] }));
// app.use(express.urlencoded({ extended: false }));

app.get("/api/contacts/:contactId", helpers.getContactById);
app.get("/api/contacts", helpers.getContacts);
app.post("/api/contacts", helpers.postContact);
app.delete("/api/contacts/:contactId", helpers.deleteContact);
app.patch("/api/contacts/:contactId", helpers.updateContact);

// APP ROUTES END
const PORT = process.env.PORT || 5005;
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`),
);
