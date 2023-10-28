const router = require("express").Router();

const authController = require("../controllers/auth.controller");

router.get("/test", (req, res, next) => {
  const refreshToken = req.cookies.refreshtoken;
  res.json({ refreshToken });
});
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh_token", authController.refreshToken);
router.post("/revoke_refresh_token", authController.revokeRefreshToken);

module.exports = router;
