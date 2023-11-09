const router = require("express").Router();

const test = require("./test");
const users = require("./users");
const prescriptions = require("./prescriptions");
const patients = require("./patients");

router.use("/test", test);
router.use("/user", users);
router.use("/prescriptions", prescriptions);
router.use("/patients", patients);

module.exports = router;
