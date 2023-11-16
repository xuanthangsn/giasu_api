const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const ClassController = require('../controllers/classController')

router.post('/get-requestClasses', ClassController.getRequestClasses )
router.post('/getTutorsByRequestClassId', ClassController.getTutorsByRequestClassId )
router.post('/create-class', ClassController.createClass )
router.post('/update-requestClass-status', ClassController.updateRequestClassStatus )

module.exports = router;