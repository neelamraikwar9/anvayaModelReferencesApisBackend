require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB;

const initializeDB = async () => {
  await mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB.");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB: ", error);
    });
};

module.exports = { initializeDB };
