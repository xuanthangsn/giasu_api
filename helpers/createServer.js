const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const appRoute = require("../routers/index");
const db = require("../models/index");
const { json } = require("sequelize");

function createServer() {
  const app = express();

  app.use(cors());

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x_authorization"
    );
    next();
  });

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/api/test", async (req, res) => {
    const users = await db.User.findAll();
    res.json(users);
  });

  app.use("/api", appRoute);

  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    // if (status === 500) {
    //   message = "Something is broken"
    // } else message = err.message;
    let resData;
    if (err.errors) {
      resData = { message: err.message, errors: err.errors };
    } else {
      resData = { message: err.message };
    }

    res.status(status).json(resData);
  });

  return app;
}

module.exports = createServer;
