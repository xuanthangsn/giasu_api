const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const ClassController = require('../controllers/classController')

router.get('/get-requestClasses', ClassController.getRequestClasses )

module.exports = router;