require("dotenv").config();
const db = require("../models/index");


const createNotice = async (req, res, next) => {
    const { userId, content, pathto } = req.body
    const isRead = 0
    try {
        const notice = await db.Notice.create({userId, content, pathto, isRead})
        return res.status(201).json(notice)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getNoticeByUserId = async (req, res, next) => {
    const { userId } = req.body
    try {
        const notices = await db.Notice.findAll({
            where: {userId},
            order: [['id', 'DESC']]
        
        })
        res.json({
            notices
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

const readNotice = async (req, res, next) => {
    const { id } = req.body
    try {
        const notice = await db.Notice.update({isRead: 1}, {
            where: {id}
        })
        res.json({
            notice
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

module.exports = { createNotice, getNoticeByUserId, readNotice }