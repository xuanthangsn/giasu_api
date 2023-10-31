const router = require("express").Router();

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const parentsController = require('../controllers/parentsController')

router.post('/requestClass', isAuth, parentsController.requestClass )

module.exports = router;