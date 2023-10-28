// const db = require("../models/index");
const toLocalDateTime = require("../helpers/toLocalDateTime");
const issueAt = toLocalDateTime(new Date());

const live_time = 7;
const expiredAt = new Date();
expiredAt.setDate(issueAt.getDate() + live_time);


console.log(issueAt);
console.log(expiredAt);
