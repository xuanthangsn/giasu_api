const router = require('express').Router();

const postController = require('../controllers/post.controller');

router.get('/', postController.findAll);
router.post('/create', postController.create);
router.put('/:post_id', postController.update);
router.delete('/:post_id', postController.delete);
router.get('/:post_id', postController.findOne);

module.exports = router;
