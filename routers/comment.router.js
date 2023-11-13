const router = require('express').Router();

const commentController = require('../controllers/comment.controller');

router.post('/', commentController.create);
router.get('/', commentController.getAll);
router.delete('/:comment_id', commentController.delete);
router.put('/:comment_id', commentController.update);

router.post('/:comment_id/:vote_type', commentController.vote);
router.delete('/:comment_id/:vote_type', commentController.delete);

module.exports = router;
