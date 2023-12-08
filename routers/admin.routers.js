const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const AdminController = require('../controllers/adminController')

router.get('/get-confirming-tutor', AdminController.getConfirmingTutor )
router.post('/update-tutor-status', AdminController.updateTutorStatus )

module.exports = router;