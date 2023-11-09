const router = require("express").Router();

const postController = require("../controllers/post.controller");

router.get("/", postController.getAll);
router.post("/create", postController.create);
router.put("/:id", postController.update);
router.delete("/delete", postController.delete);
router.get("/:post_id", postController.get);

module.exports = router;