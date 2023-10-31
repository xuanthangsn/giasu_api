const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const tutorController = require('../controllers/tutorController')

router.post('/tutorregister', isAuth, tutorController.tutor_register )
router.post('/get-tutor', tutorController.getTutor )

module.exports = router;