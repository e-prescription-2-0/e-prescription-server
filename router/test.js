const express = require("express");
const accesRouteGuard = require("../middlewares/accessRouteGuard");
const router = express.Router();

const testData = {
  name: "e-prescription-server",
  version: "1.0.0",
  description: "REST-api for back-end of e-prescription React app",
  main: "index.js",
};

//example for using middleware

router.get("/", accesRouteGuard('doctor'), function (req, res) {
  console.log("Hello from test router");
  res.send(testData);
});

module.exports = router;
