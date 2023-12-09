const router = require("express").Router();

const NoticeController = require('../controllers/noticeController')

router.post('/create-notice', NoticeController.createNotice)
router.post('/get-notice-by-userid', NoticeController.getNoticeByUserId)
router.post('/read-notice', NoticeController.readNotice)

module.exports = router