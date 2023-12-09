const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const parentsController = require('../controllers/parentsController')

router.post('/requestClass', parentsController.requestClass )
router.post('/get-requestClass-of-parents', parentsController.getRequestClassesOfParents )
router.post('/get-class-by-id', parentsController.getClasssById)
router.get('/getAllRequestClass', parentsController.getRequestClasses);
module.exports = router;