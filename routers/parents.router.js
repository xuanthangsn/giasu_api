const router = require("express").Router();
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 5 * 1000, // 1 minutes
    max: 2,
    message: 'Too many connection',
});

const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

const parentsController = require('../controllers/parentsController')

router.post('/requestClass', isAuth, parentsController.requestClass )
router.post('/get-requestClass-of-parents', isAuth, parentsController.getRequestClassesOfParents )
router.post('/get-class-by-id', isAuth, parentsController.getClasssById)

module.exports = router;