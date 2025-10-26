const mongoose = require("mongoose");
const DBURL = process.env.ATLAS_DBURL || process.env.DBURL;

mongoose
  .connect(DBURL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

module.exports = mongoose;
console.log("DB is working");
