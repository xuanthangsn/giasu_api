require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const db = require("../models/index");
const user = require("../models/user");

const app = express();
const PORT = process.env.PORT;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/test", (req, res) => {
  res.json("This is test route");
});

app.post("/users", async (req, res) => {
  try {
    var user = await db.User.create({ firstName: "xuan", lastName: "thang" });
  } catch (error) {
    console.log(error);
  }
  res.json(user);
});

app.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`);
});
