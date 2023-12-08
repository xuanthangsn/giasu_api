const router = require("express").Router();


const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const tutorController = require('../controllers/tutorController')

router.post('/tutorregister', tutorController.tutor_register )
router.post('/get-tutor', tutorController.getTutor )
router.get('/get-confirmed-tutors', tutorController.getConfirmedTutors )
router.post('/getSubjectsOfTutors', tutorController.getSubjectsOfTutors )
router.post('/apply-class', tutorController.applyClass )
router.post('/check-applied', tutorController.checkApplied )

module.exports = router;