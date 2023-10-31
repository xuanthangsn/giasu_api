require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");

const tutor_register = async(req, res, next) => {
    const { userId, name, phone, school, specialized, job, expTeach, subjectRange, classRange, skillRange, subjects,	schedule, description, role, status, gender, birth, address } = req.body;
    const subjectIds = []
    subjects.forEach(subject => {
        if (subject.canTeach) {
            subject.grade.forEach(async g => {
                try {
                    const id = await db.Subject.findOne({where: {name: subject.subject, grade: g}})
                    // console.log(id.id)
                    subjectIds.push(id.id)
                    // console.log('subjects: ' + subjectIds.join(','))
                } catch (err) {
                    if (!err.statusCode) {
                        err.statusCode = 501;
                    }
                    next(err);
                }
            })
        }
    })
    try {
        
        const tutor = await db.Tutor.findOne({where: {userID: userId}})
        await tutor.update({name, phone, school, specialized, job, expTeach, subjectRange, classRange, skillRange, subjectIds: subjectIds.join(','),	schedule, description, role, status, gender, birth, address})
        // await tutor.update({name: 'quan'})
        res.json({
            tutor
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const getTutor = async(req, res, next) => {
    const { userID } = req.body
    try {
        const tutor = await db.Tutor.findOne({where: {userID: userID}})
        // await tutor.update({name: 'quan'})
        res.json({
            tutor
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}




module.exports = { tutor_register, getTutor }