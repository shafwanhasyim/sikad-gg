require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

mongoose.connect(process.env.CONNECTION_STRING);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected to MongoDB Netlab");
});

app.use("/user", require("./src/routes/user.route"));
app.use("/matakuliah", require("./src/routes/matkul.route"));
app.use("/nilai", require("./src/routes/nilai.route"));

app.listen(PORT, () => console.log(`🚀 Server started at port:${PORT}`));
