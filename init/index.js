const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

require("dotenv").config();
const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => {
    return {
      ...obj,
      owner: "652d0081ae547c5d37e56b5f",
      geometry: {
        type: "Point",
        coordinates: [77.5946, 12.9716]
      }
    };
  });

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};