const express = require("express");
const app = express();

const config = require("./config.json");

//== connect to database
const mongoURI =
  config.MONGODB_URI || "mongodb://localhost:27017" + "/newsFeed";

let mongoose = require("mongoose");
const newsArticleModel = require("./model");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

// your code here!
// Return a non-negative integer only. Any missing, fractional, negative, or
// non-numeric query value falls back to the endpoint's documented default.
const getPaginationValue = (value, defaultValue, minimum) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return defaultValue;
  }

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue >= minimum
    ? parsedValue
    : defaultValue;
};

// GET /newsFeeds?limit=10&offset=0
// Fetch the stored documents directly so their structure is not changed.
app.get("/newsFeeds", async (req, res, next) => {
  const limit = getPaginationValue(req.query.limit, onePageArticleCount, 1);
  const offset = getPaginationValue(req.query.offset, 0, 0);

  try {
    const articles = await newsArticleModel.find({}).skip(offset).limit(limit);
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
});



// ==end==

module.exports = { app, db };
