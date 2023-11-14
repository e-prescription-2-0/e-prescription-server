const router = require("express").Router();

const test = require("./test");
const users = require("./users");
const prescriptions = require("./prescriptions");
const patients = require("./patients");
const doctors = require("./doctors");
const pharmacists = require("./pharmacists");

router.use("/test", test);
router.use("/user", users);
router.use("/prescriptions", prescriptions);
router.use("/patients", patients);
router.use("/doctors", doctors);
router.use("/pharmacists", pharmacists);

module.exports = router;
