require("dotenv").config();
const db = require("../models/index");
const { Sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize');
const Op = Sequelize.Op

const getTutorData = async (userId) => {
    const user = await db.User.findByPk(userId);
    const tutor = await db.Tutor.findOne({ where: { userID: userId } });
    return {
        ...tutor,
        role: user.role,
        gender: user.gender,
        birth: user.birth,
        phone: user.phone,
        adderss: user.address
    };
}

// use case: bo sung day du thong tin cua tutor
// grant access if: userId trong req.body trung voi id cua current logged user
const tutor_register = async (req, res, next) => {
    const expectedBody = [
        "userId",
        "name",
        "school",
        "specialized",
        "job",
        "expTeach",
        "skillRange",
        "subjects",
        "schedule",
        "description",
    ];
    let updateBody = {};
    for (key in req.body) {
        if (expectedBody.includes(key)) {
            updateBody[key] = req.body[key];
        }
    }

    if (updateBody.subjects !== undefined) {
        const subjectIds = [];
        subjects.forEach((subject) => {
            if (subject.canTeach) {
                subject.grade.forEach(async (g) => {
                    try {
                        const id = await db.Subject.findOne({
                            where: { name: subject.subject, grade: g },
                        });
                        subjectIds.push(id.id);
                    } catch (err) {
                        if (!err.statusCode) {
                            err.statusCode = 501;
                        }
                        next(err);
                    }
                });
            }
        });
        updateBody.subjectIds = subjectIds.join(",");
    }
    try {
        const user = await db.User.findByPk(userID);
        const tutor = await db.Tutor.findOne({ where: { userID: userID } });
        await tutor.update(updateBody);

        res.json({
            tutor: {
                ...tutor,
                role: user.role,
                gender: user.gender,
                birth: user.birth,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


// use case: lay thong tin cua current logged in tutor
// grant access if: userId trong req.body trung voi id cua current logged user
const getTutor = async(req, res, next) => {
    const { userID } = req.body
    try {
        const user = await db.User.findByPk(userID);
        const tutor = await db.Tutor.findOne({where: {userID: userID}})
        res.json({
          tutor: {
            ...tutor,
            role: user.role,
            gender: user.gender,
            birth: user.birth,
            phone: user.phone,
            address: user.address,
          },
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// use case: given a list of subject's id, return a collection of subject model
// grant access to: all?
const getSubjectsOfTutors = async (req, res, next) => {
    const ids = req.body.ids
    
    const convertIds = ids.split(',').map((id) => {
        return {id : id}
    })

    // convertIds = [{id: 1}, {id: 2}, {id: 3}, ]
    
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

// use case: get all tutor where status='confirmed'
// grant access to: admin?
const getConfirmedTutors = async (req, res, next) => {
    
    try {
        const tutors = await db.sequelize.query(`select * from tutors where status = 'confirmed'`, { type: QueryTypes.SELECT });
        const tutorData = [];
        for (const tutor of tutors) {
          const user = await db.User.findOne({ where: { id: tutor.userID } });
          tutorData.push({
            ...tutor,
            role: user.role,
            gender: user.gender,
            birth: user.birth,
            phone: user.phone,
            adderss: user.address,
          });
        }
        res.json({
            tutors: tutorData
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

//use case: tutor apply to a class
// grant access if: tutorId trong req.body trung voi id cua current logged user
const applyClass = async (req, res, next) => {
    const {classId, tutorId} = req.body
    try {
        const tutor = await getTutorData(tutorId);
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

// use case: check if current tutor is applied to a specified class
// grant access if: tutorId trong req.body trung voi id cua current logged in user
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