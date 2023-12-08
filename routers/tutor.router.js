const router = require("express").Router();
// const rateLimit = require('express-rate-limit');

// const apiLimiter = rateLimit({
//     windowMs: 1000, // 1 minutes
//     max: 200,
//     message: 'Too many connection',
// });



const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const tutorController = require('../controllers/tutorController')

router.post('/tutorregister', isAuth, tutorController.tutor_register )
router.post('/get-tutor', tutorController.getTutor )
router.get('/get-confirmed-tutors', tutorController.getConfirmedTutors )
router.post('/get-filtered-tutors', tutorController.filterTutor )
router.post('/getSubjectsOfTutors', tutorController.getSubjectsOfTutors )
router.post('/apply-class', tutorController.applyClass )
router.post('/check-applied', tutorController.checkApplied )
router.post('/get-applied-class-of-tutor', tutorController.getAppliedClassOfTutor )
router.post('/get-requested-class', tutorController.getRequestedClass )
router.delete('/cancel-request-class', tutorController.cancelRequestClass )

module.exports = router;