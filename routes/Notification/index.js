const express   = require('express');
const checkJwt   = require('../../middlewares/checkJwt');
const router    = express.Router();

const Notification = require('../../controllers').Notification;

router.get('/get-all',checkJwt,Notification.getAll)
router.post('/create',checkJwt,Notification.create)
router.patch('/update/:id',checkJwt,Notification.updateStatus)
router.delete('/delete/:id',checkJwt,Notification.remove)

module.exports = router;