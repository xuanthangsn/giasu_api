require("dotenv").config();
const db = require("../models/index");
const { QueryTypes } = require("sequelize");
const {
  generatePdfContract,
} = require("../services/contract-generator.service/index");

// use case: get all request class satisfied the requirements passed in req.body
const getRequestClasses = async (req, res, next) => {
  const { subjectArrays, gradesArray, skillsArrays } = req.body;
  let subjects = subjectArrays.map((subject) => {
    return "subject = " + `'${subject}'`;
  });
  let grades = gradesArray.map((grade) => {
    switch (grade) {
      case "Cấp 1":
        return `grade = 'Lớp 1' OR grade = 'Lớp 2' OR grade = 'Lớp 3' OR grade = 'Lớp 4' OR grade = 'Lớp 5'`;
      case "Cấp 2":
        return `grade = 'Lớp 6' OR grade = 'Lớp 7' OR grade = 'Lớp 8' OR grade = 'Lớp 9'`;
      case "Cấp 3":
        return `grade = 'Lớp 10' OR grade = 'Lớp 11' OR grade = 'Lớp 12'`;
    }
  });
  let skills = skillsArrays.map((skill) => {
    return "skill = " + `'${skill}'`;
  });
  const query = `${
    subjects.length > 0 ? " AND (" + subjects.join(" OR ") + ")" : ""
  }${grades.length > 0 ? " AND (" + grades.join(" OR ") + ")" : ""}${
    skills.length > 0 ? " AND (" + skills.join(" OR ") + ")" : ""
  }`;
  try {
    let classes;
    classes = await db.sequelize.query(
      `SELECT * FROM requestClasses WHERE status = 'confirming'${query}`,
      { type: QueryTypes.SELECT }
    );
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

// use case: update request class status with specified id
const updateRequestClassStatus = async (req, res, next) => {
  const { id } = req.body;
  const status = "confirmed";
  try {
    const r_class = await db.RequestClasses.findOne({ where: { id: id } });
    await r_class.update({ status });
    res.json({
      message: "class updated.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: get tutor by request class id
const getTutorsByRequestClassId = async (req, res, next) => {
  const { id } = req.body;
  try {
    const tutors = await db.sequelize.query(
      `SELECT * FROM tutors 
            JOIN tutor_request_classes 
            ON tutors.userID = tutor_request_classes.tutor_id 
            WHERE tutor_request_classes.request_class_id = ${id};`,
      { type: QueryTypes.SELECT }
    );
    let tutorData = {};
    if (tutors.length > 0) {
      const userId = tutors[0].userID;
      const user = db.User.findByPk(userId);
      tutorData = {
        ...tutors[0],
        role: user.role,
        gender: user.gender,
        birth: user.birth,
        phone: user.phone_number,
        adderss: user.address,
      };
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


// use case: create new class
const createClass = async (req, res, next) => {
  const {
    parent_id,
    tutor_id,
    request_class_id,
    address,
    detail_address,
    price,
    frequency,
  } = req.body;
  try {
    const newClass = await db.Class.create({
      parent_id,
      tutor_id,
      request_class_id,
      address,
      detail_address,
      price,
      frequency,
    });
    res.json({
      message: "create class successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: get the contract given the class information
const getContract = async (req, res, next) => {
  const classInformation = req.body;
  // const classInformation = {tutor, parent, classInfo}
  // lay thong tin ve lop
  // const classInformation = {
  //     tutor: {
  // name: "Tran Xuan Thang",
  // phone: "0962597636",
  // birth: "26/12/2002",
  // address: "Ngo 150, Hoa Bang, Cau Giay, Ha Noi",
  // job: "Student"
  //     },
  //     parent: {
  // name: "Hoang Phuong Linh",
  // phone: "0833020475",
  // address: "Hoang Mai, Cau Giay, Ha Noi"
  //     },
  //     class: {
  // subject: "Toan 7",
  // schedule: "2b/tuan",
  // price: "150k/buoi",
  // time_per_day: "2h/buoi"
  //     }
  // };

  try {
    const pdfBuffer = await generatePdfContract(classInformation);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=contract.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};


//use case: get request class given the id
const getRequestClassByRequestId = async (req, res, next) => {
  const { id } = req.body;
  try {
    const requestClass = await db.RequestClasses.findOne({ where: { id: id } });
    res.json({
      requestClass,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getRequestClasses,
  getTutorsByRequestClassId,
  createClass,
  updateRequestClassStatus,
  getContract,
  getRequestClassByRequestId,
};
