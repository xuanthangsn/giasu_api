const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middlewares/auth.middlewares');
const isAuth = authMiddleware.isAuth

router.get("/test", (req, res, next) => {
  const { name } = req.body;
  res.json({
    message: "success",
    name
  });
});
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh_token", authController.refreshToken);
router.post("/revoke_refresh_token", authController.revokeRefreshToken);
router.post('/tutorregister', isAuth, )

module.exports = router;
