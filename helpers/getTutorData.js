const db = require("../models/index");

const getTutorData = async (userId) => {
  const user = await db.User.findByPk(userId);
  const tutor = await db.Tutor.findOne({ where: { userID: userId } });
  return {
    ...tutor,
    role: user.role,
    gender: user.gender,
    birth: user.birth,
    phone: user.phone_number,
    adderss: user.address,
  };
};


module.exports = getTutorData;