require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");
const { Sequelize } = require("sequelize");
// const Op = require('@sequelize/core');
const Op = Sequelize.Op

const tutor_register = async(req, res, next) => {
    const { userId, name, phone, school, specialized, job, expTeach, skillRange, subjects, schedule, description, role, status, gender, birth, address } = req.body;
    console.log('name: ' + name)
    const subjectIds = []
    subjects.forEach(subject => {
        if (subject.canTeach) {
            subject.grade.forEach(async g => {
                try {
                    const id = await db.Subject.findOne({where: {name: subject.subject, grade: g}})
                    subjectIds.push(id.id)
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
        await tutor.update({name, phone, school, specialized, job, expTeach, skillRange, subjectIds: subjectIds.join(','),	schedule, description, role, status, gender, birth, address})
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

const getSubjectsOfTutors = async (req, res, next) => {
    const ids = req.body.ids
    
    const convertIds = ids.split(',').map((id) => {
        return {id : id}
    })

    // const convertIds = [{id: 1}, {id: 2}, {id: 3}, ]
    
    try {
        const subject = await db.Subject.findAll({
            where: {
                [Op.or]: convertIds
            }})    
        res.json({
            subject
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }

}

const getConfirmedTutors = async (req, res, next) => {
    
    try {
        const tutors = await db.Tutor.findAll({where: {status: 'confirmed'}})
        res.json({
            tutors
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const applyClass = async (req, res, next) => {
    const {classId, tutorId} = req.body
    try {
        const tutor = await db.Tutor.findOne({where: {userID: tutorId}})
        const requestClass = await db.RequestClasses.findOne({where: {id: classId}})

        // gender - subjectIds - schedule
        if (tutor.gender == requestClass.requiredGender && tutor.subjectIds.split(',').includes(requestClass.subjectIds)) {
            let countSameSchedule = 0
            tutor.schedule.split(',').forEach(session => {
                if (requestClass.schedule.split(',').includes(session)) {
                    countSameSchedule++
                }
            })
            if (countSameSchedule > requestClass.frequency) {
                const tutorToClass = await db.tutor_request_class.create({
                    tutor_id: tutorId,
                    request_class_id: classId
                })

                res.json({
                    isPassed: true, 
                    total: countSameSchedule
                })
            } else {
                res.json({
                    tutor, 
                    requestClass,
                    isPassed: false
                })
            }
        } else {
            res.json({
                tutor, 
                requestClass,
                isPassed: false
            })
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const checkApplied = async (req, res, next) => {
    const {classId, tutorId} = req.body
    try {
        const count = await db.tutor_request_class.count({where: {
            tutor_id: tutorId,
            request_class_id: classId
        }})
        if (count == 0) {
            res.json({
                isApplied: false,
            })
        } else {
            res.json({
                isApplied: true
            })
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



module.exports = { tutor_register, getTutor, getConfirmedTutors, getSubjectsOfTutors, applyClass, checkApplied }