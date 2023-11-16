require("dotenv").config();
const db = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const toLocalDateTime = require("../helpers/toLocalDateTime");
const { QueryTypes } = require('sequelize');
const { generatePdfContract } = require("../services/contract-generator.service/index");

const getRequestClasses = async(req, res, next) => {
    try {
        const classes = await db.RequestClasses.findAll({})
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

const updateRequestClassStatus = async (req, res, next) => {
    const { id } = req.body
    const status = 'confirmed'
    try {
        const r_class = await db.RequestClasses.findOne({where: {id: id}})
        await r_class.update({status})
        res.json({
            message: 'class updated.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// const getSubjectsById = async(req, res, next) => {
//     const {id} = req.body
//     try {
//         const classes = await db.sequelize.query()
//         res.json({
//             classes
//         })
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }

const getTutorsByRequestClassId = async (req, res, next) => {
    const {id} = req.body
    try {
        const tutors = await db.sequelize.query(
            `SELECT * FROM tutors 
            JOIN tutor_request_classes 
            ON tutors.userID = tutor_request_classes.tutor_id 
            WHERE tutor_request_classes.request_class_id = ${id};`,
            {type: QueryTypes.SELECT}
        )
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

const createClass = async (req, res, next) => {
    const { parent_id, tutor_id, request_class_id, address, detail_address, price, frequency } = req.body
    try {
        const newClass = await db.Class.create({
            parent_id, tutor_id, request_class_id, address, detail_address, price, frequency
        })
        res.json({
            message: 'create class successfully!'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }   
}

const getContract = async (req, res, next) => {
    // lay thong tin ve lop
    const classInformation = {
        tutor: {
            name: "Tran Xuan Thang",
            phone: "0962597636",
            birth: "26/12/2002",
            address: "Ngo 150, Hoa Bang, Cau Giay, Ha Noi",
            job: "Student"
        },
        parent: {
            name: "Hoang Phuong Linh",
            phone: "0833020475",
            address: "Hoang Mai, Cau Giay, Ha Noi"
        },
        class: {
            subject: "Toan 7",
            schedule: "2b/tuan",
            price: "150k/buoi",
            time_per_day: "2h/buoi"
        }
    };

    try {
        const pdfBuffer = await generatePdfContract(classInformation);
         res.setHeader("Content-Type", "application/pdf");
         res.setHeader(
           "Content-Disposition",
           "attachment; filename=contract.pdf"
         );
         res.send(pdfBuffer);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        throw err;
    }
} 

module.exports = { getRequestClasses, getTutorsByRequestClassId, createClass, updateRequestClassStatus, getContract}