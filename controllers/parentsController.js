require("dotenv").config();
const db = require("../models/index");
const { QueryTypes } = require("sequelize");


// use case: parent create a request class
// grant access to: role of user is parent,
// parentID refers to id of user or id of parent?
const requestClass = async (req, res, next) => {
  const {
    parentID,
    parentName,
    phone,
    studentGender,
    requiredGender,
    address,
    detailAddress,
    grade,
    subject,
    skill,
    studentCharacter,
    schedule,
    frequency,
    salary,
    otherRequirement,
    status,
  } = req.body;
  let subjectIds;
  try {
    const id = await db.Subject.findOne({
      where: { name: subject, grade: grade },
    });
    if (!id) {
      const err = new Error("Subject not found");
      err.statusCode = 501;
      throw err;
    }
    subjectIds = id.id;
    const requestclass = await db.RequestClasses.create({
      parentID,
      parentName,
      phone,
      studentGender,
      requiredGender,
      address,
      detailAddress,
      grade,
      subject,
      skill,
      studentCharacter,
      schedule,
      frequency,
      salary,
      otherRequirement,
      status,
      subjectIds,
    });
    return res.status(201).json({ message: "Request class successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: get all request class
// grant access to: admin?, parent?
const getRequestClasses = async (req, res, next) => {
  try {
    const classes = await db.RequestClasses.findAll();
    res.json({
      classes,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: get all request class of the specified parent
// grant access of: user of role parent, parentID in req.body is the same as id of the current logged in user
const getRequestClassesOfParents = async (req, res, next) => {
  const { parentID } = req.body;
  try {
    const classes = await db.sequelize.query(
      `SELECT *, requestclasses.id as reqId
            FROM requestclasses 
            JOIN subjects ON requestclasses.subjectIds = subjects.id 
            WHERE parentID = ${parentID} AND (requestclasses.status='confirming' OR requestclasses.status='wait-for-tutor')`,
            {type: QueryTypes.SELECT}
        )
        console.log(classes)
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



// use case: get all class of a specified parent id
// grant access to: user of role parent, id in req.body is the same as id of the logged in user
const getClasssById = async (req, res, next) => {
  const { id } = req.body;
  try {
    const classes = await db.Class.findAll({ where: { parent_id: id } });
    res.json({
      classes,
    });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  requestClass,
  getRequestClasses,
  getRequestClassesOfParents,
  getClasssById,
};
