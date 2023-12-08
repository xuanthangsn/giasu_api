require("dotenv").config();
const db = require("../models/index");

// use case: get all tutor where status="confirming"
// grant access to: admin
const getConfirmingTutor = async (req, res, next) => {
  try {
    const tutors = await db.Tutor.findAll({ where: { status: "confirming" } });
    const tutorData = [];
    for (const tutor of tutors) {
      const user = await db.User.findOne({ where: { id: tutor.userID } });
      if (!user) {
        const err = new Error("Database conflict");
        throw err;
      }
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
      tutors: tutorData
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// use case: update the specified tutor status
// grant access to: admin
const updateTutorStatus = async (req, res, next) => {
  const { userID, status } = req.body;
  try {
    const tutor = await db.Tutor.findOne({ where: { userID: userID } });
    if (!tutor) {
      const err = new Error("No user found");
      throw err;
    }
    await tutor.update({ status });
    res.json({
      message: "update tutor status successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = { getConfirmingTutor, updateTutorStatus };
