const express = require("express");
const checkJwt = require("../../middlewares/checkJwt");
const router = express.Router();

const Schedule = require("../../controllers").Schedule;

router.get("/get-all", checkJwt, Schedule.getAll);
router.get("/get/:doctor_id", checkJwt, Schedule.get);
router.post("/create", checkJwt, Schedule.create);
router.patch("/update/:doctor_id", checkJwt, Schedule.update);
router.delete("/delete", checkJwt, Schedule.remove);

module.exports = router;
