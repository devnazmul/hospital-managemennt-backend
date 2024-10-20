const express = require("express");
const checkJwt = require("../../middlewares/checkJwt");
const router = express.Router();

const Admin = require("../../controllers").Admin;

router.post("/registration", Admin.registration);
router.post("/login", Admin.login);
router.get("/get-all/:role", checkJwt, Admin.getAll);
router.get("/dashboard", checkJwt, Admin.dashboard);
router.get("/get-withjwt", checkJwt, Admin.getByJWT);
router.get("/get/:id", checkJwt, Admin.getSingle);
router.patch("/update/:id", checkJwt, Admin.update);
router.delete("/delete/:id", checkJwt, Admin.remove);

module.exports = router;
