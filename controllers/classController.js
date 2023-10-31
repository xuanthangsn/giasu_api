require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");

const getRequestClasses = async(req, res, next) => {
    try {
        const classes = await db.RequestClasses.findAll({})
        res.json({
            classes
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports = { getRequestClasses }