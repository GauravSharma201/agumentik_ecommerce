const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes.js");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(router);

process.on("uncaughtException", (error) => {
  // handlig uncaught execptions...
  console.log(error.message);
  console.log("Shutting down server due to Uncaught Execption");
  process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

const port = process.env.PORT || 5000;
const connectionURL = process.env.CONNECTION_URL;

function connectToDB() {
  mongoose
    .connect(connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(`MongoDB connected to the server: ${data.connection.host}`);
    });
}
connectToDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(5000, () => {
  console.log(`Server listening to port: ${port}...`);
});

process.on("unhandledRejection", (error) => {
  console.log(error.message);
  console.log("Shutting down server due to Unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});
