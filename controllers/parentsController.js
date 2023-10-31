require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");

const requestClass = async(req, res, next) => {
    const { parentID, parentName, phone, studentGender, requiredGender, address, grade, subject, skill, studentCharacter, schedule, frequency, salary, otherRequirement, status } = req.body
    try{
        const requestclass = db.RequestClasses.create(
            {
                parentID, 
                parentName, 
                phone, 
                studentGender, 
                requiredGender, 
                address, 
                grade, 
                subject, 
                skill, 
                studentCharacter, 
                schedule, 
                frequency, 
                salary, 
                otherRequirement, 
                status
            }
        )
        return res.status(200).json({ message: 'Request class successfully' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getRequestClasses = async(req, res, next) => {
    try {
        const classes = await db.RequestClasses.fineAll()
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

module.exports = { requestClass, getRequestClasses }