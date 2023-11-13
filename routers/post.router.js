const router = require('express').Router();

const postController = require('../controllers/post.controller');

router.get('/', postController.findAll);
router.post('/create', postController.create);
router.put('/:post_id', postController.update);
router.delete('/:post_id', postController.delete);
router.get('/:post_id', postController.findOne);

router.post('/:post_id/:vote_type', postController.vote);
router.delete('/:post_id/:vote_type', postController.delete);

module.exports = router;
