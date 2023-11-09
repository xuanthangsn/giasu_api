const router = require("express").Router();

const commentController = require("../controllers/comment.controller");

router.post("/", commentController.create);
router.get("/", commentController.getAll);
router.delete("/:comment_id", commentController.delete);


module.exports = router;