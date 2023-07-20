const express   = require('express');
const router    = express.Router();
const checkJwt = require('../../middlewares/checkJwt')
const Appointment = require('../../controllers').Appointment;

router.get('/get-all',checkJwt,Appointment.getAll)
router.get('/get/:id',checkJwt,Appointment.get)
router.post('/create',checkJwt,Appointment.create)
router.patch('/update/:id',checkJwt,Appointment.update)
router.delete('/delete/:id',checkJwt,Appointment.remove)

module.exports = router;