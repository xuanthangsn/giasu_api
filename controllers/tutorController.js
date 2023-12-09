// controllers/tutorController.js

require("dotenv").config();
const db = require("../models/index");
const { Sequelize } = require("sequelize");

const { QueryTypes } = require("sequelize");
const Op = Sequelize.Op;
const getTutorData = require("../helpers/getTutorData");

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
    for (subject of updateBody.subjects) {
      if (subject.canTeach) {
        for (g of subject.grade) {
          try {
            const s = await db.Subject.findOne({
              where: { name: subject.subject, grade: g },
            });
            if (!s) {
              const err = new Error("subject not found");
              err.statusCode = 501;
              throw err;
            }
            subjectIds.push(s.id);
          } catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          }
        }
      }
    }
    updateBody.subjectIds = subjectIds.join(",");
  }
  try {
    const user = await db.User.findByPk(updateBody.userId);
    const tutor = await db.Tutor.findOne({
      where: { userID: updateBody.userId },
    });
    await tutor.update(updateBody);

    res.json({
      tutor: {
        ...tutor,
        role: user.role,
        gender: user.gender,
        birth: user.birth,
        phone: user.phone_number,
        address: user.address,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: lay thong tin cua current logged in tutor
// grant access if: userId trong req.body trung voi id cua current logged user
const getTutor = async (req, res, next) => {
  const { userID } = req.body;
  try {
    const user = await db.User.findByPk(userID);
    const tutor = await db.Tutor.findOne({ where: { userID: userID } });
    res.json({
      tutor: {
        ...tutor,
        role: user.role,
        gender: user.gender,
        birth: user.birth,
        phone: user.phone_number,
        address: user.address,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: given a list of subject's id, return a collection of subject model
// grant access to: all?
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
      next(err);
    }
    
  }


// use case: get all tutor where status='confirmed'
// grant access to: admin?
const getConfirmedTutors = async (req, res, next) => {
  try {
    const tutors = await db.sequelize.query(
      `select * from tutors where status = 'confirmed'`,
      { type: QueryTypes.SELECT }
    );
    const tutorData = [];
    for (const tutor of tutors) {
      const user = await db.User.findOne({ where: { id: tutor.userID } });
      tutorData.push({
        ...tutor,
        role: user.role,
        gender: user.gender,
        birth: user.birth,
        phone: user.phone_number,
        adderss: user.address,
      });
    }
    res.json({
      tutors: tutorData,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//use case: tutor apply to a class
// grant access if: tutorId trong req.body trung voi id cua current logged user
const applyClass = async (req, res, next) => {

  const { classId, tutorId } = req.body;
  try {
    const tutor = await getTutorData(tutorId);
    const requestClass = await db.RequestClasses.findOne({
      where: { id: classId },
    });
    if (
      tutor.gender == requestClass.requiredGender &&
      tutor.subjectIds.split(",").includes(requestClass.subjectIds)
    ) {
      let countSameSchedule = 0;
      tutor.schedule.split(",").forEach((session) => {
        if (requestClass.schedule.split(",").includes(session)) {
          countSameSchedule++;
        }
      });
      if (countSameSchedule >= requestClass.frequency) {
        const tutorToClass = await db.tutor_request_class.create({
          tutor_id: tutorId,
          request_class_id: classId,
        });

        res.json({
          isPassed: true,
          total: countSameSchedule,
        });
      } else {
        res.json({
          tutor,
          requestClass,
          isPassed: false,
        });
      }
    } else {
      res.json({
        tutor,
        requestClass,
        isPassed: false,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: check if current tutor is applied to a specified class
// grant access if: tutorId trong req.body trung voi id cua current logged in user
const checkApplied = async (req, res, next) => {
  const { classId, tutorId } = req.body;
  try {
    const count = await db.tutor_request_class.count({
      where: {
        tutor_id: tutorId,
        request_class_id: classId,
      },
    });
    if (count == 0) {
      res.json({
        isApplied: false,
      });
    } else {
      res.json({
        isApplied: true,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
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

