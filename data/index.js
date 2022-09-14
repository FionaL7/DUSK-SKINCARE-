require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const productData = require("./productData");
// const dbUrl = process.env.DB_URL;

mongoose.connect("mongodb://localhost:27017/dusk", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const importData = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(productData);
    console.log("imported");
  } catch (e) {
    console.log("Error", e);
  }
};

importData().then(() => {
  mongoose.connection.close();
});
