require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");
const { Sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize');
// const Op = require('@sequelize/core');
// const Op = Sequelize.Op
const Op = require('sequelize')

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
        await tutor.update({name, phone, school, specialized, job, expTeach, skillRange, subjectIds: ',' + subjectIds.join(',') + ',',	schedule, description, role, status, gender, birth, address})
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
        return `id=${id}`
    })


    
    try {
        
        // const subject = await db.Subject.findAll({
        //     where: {
        //         [Op.or]: [{id: 1}]
        //     }})    
        
        console.log(convertIds)
        const subject = await db.sequelize.query(`select * from subjects where ${convertIds.join(' OR ')}`)

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
        const tutors = await db.sequelize.query(`select * from tutors where status = 'confirmed'`, {type: QueryTypes.SELECT})
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
        if (tutor.gender == requestClass.requiredGender && tutor.subjectIds.split(',').includes(requestClass.subjectIds)) {
            let countSameSchedule = 0
            tutor.schedule.split(',').forEach(session => {
                if (requestClass.schedule.split(',').includes(session)) {
                    countSameSchedule++
                }
            })
            console.log("frequency: " + countSameSchedule)
            console.log("frequency: " + requestClass.frequency)
            if (countSameSchedule >= requestClass.frequency) {
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

const getAppliedClassOfTutor = async (req, res, next) => {
    const { tutorId } = req.body
    try {
        const classes = await db.sequelize.query(
            `SELECT *, tutor_request_classes.id AS t_r_c_id
            FROM tutor_request_classes 
            JOIN requestclasses 
            ON tutor_request_classes.request_class_id = requestclasses.id 
            Where tutor_id = ${tutorId}`, 
            {type: QueryTypes.SELECT}
        )
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

const cancelRequestClass = async (req, res, next) => {
    const {id} = req.body
    try {
        await db.tutor_request_class.destroy({
            where: {id}
        })
        res.json({
            status: 'deleted request'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const filterTutor = async(req, res, next) => {
    const {subjectArrays, gradesArray, skillsArrays} = req.body
    // let subjects = subjectArrays.map(subject => {
    //     switch (subject) {
    //         case 'Toán':
    //             return 12
    //         case 'Vật lý':
    //             return 24
    //         case 'Hóa':
    //             return 36
    //         case 'Sinh':
    //             return 48
    //         case 'Tiếng Anh':
    //             return 60
    //         case 'Văn':
    //             return 72
    //         case 'Lịch sử':
    //             return 84
    //         case 'Địa':
    //             return 96
    //         case 'Tin':
    //             return 108
    //         case 'Toán + TV':
    //             return 120
    //         default:
    //             return 0
    //     }
    // })
    let subjects = subjectArrays.map(subject => {
        return 'name = ' + `'${subject}'`
    })
    let grades = gradesArray.map(grade => {
        switch (grade) {
            case 'Cấp 1': return `grade = 'Lớp 1' OR grade = 'Lớp 2' OR grade = 'Lớp 3' OR grade = 'Lớp 4' OR grade = 'Lớp 5'`;
            case 'Cấp 2': return `grade = 'Lớp 6' OR grade = 'Lớp 7' OR grade = 'Lớp 8' OR grade = 'Lớp 9'`;
            case 'Cấp 3': return `grade = 'Lớp 10' OR grade = 'Lớp 11' OR grade = 'Lớp 12'`;
        }
    })
    let skills = skillsArrays.map(skill => {
        return 'skillRange like ' + `'%${skill}%'`
    })
    const query = `${subjects.length > 0 ? ' AND (' + subjects.join(' OR ') + ')' : ''}${grades.length > 0 ? ' AND (' + grades.join(' OR ') + ')': ''}`
    try {
        const t_tutors = await db.sequelize.query(`select * from tutors where status = 'confirmed' ${skills.length > 0 ? ' AND (' + skills.join(' OR ') + ')' : ''}`, {type: QueryTypes.SELECT})
        const subjects = await db.sequelize.query(`SELECT * FROM subjects WHERE 1=1 ${query}`, { type: QueryTypes.SELECT })
        // console.log(subjects)
        const tutors = []
        t_tutors.forEach((tutor) => {
            var tutor_subjectIds = tutor.subjectIds.split(',').map(id => parseInt(id))

            console.log(tutor_subjectIds)
            subjects.forEach(s => {
                if ( tutor_subjectIds.includes(s.id) && !tutors.includes(tutor)) {
                    tutors.push(tutor)
                }
            })
        })
        // console.log(tutors)
        res.json({
            tutors,
            subjects
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getRequestedClass = async (req, res, next) => {
    const { requestTutorId } = req.body
    try {
        const classes = await db.sequelize.query(`
            SELECT * FROM requestclasses WHERE status='wait-for-tutor' AND requestTutorId=${requestTutorId}
        `
        , { type: QueryTypes.SELECT })

        res.json({
            classes
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            res.json({
                err
            })
        }
        next(err);
    }
}



module.exports = { 
    tutor_register, 
    getTutor, 
    getConfirmedTutors, 
    getSubjectsOfTutors, 
    applyClass, 
    checkApplied, 
    getAppliedClassOfTutor, 
    cancelRequestClass,
    filterTutor,
    getRequestedClass
}