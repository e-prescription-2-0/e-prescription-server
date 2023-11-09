const express = require("express");
const router = express.Router();

const testData = {
  name: "e-prescription-server",
  version: "1.0.0",
  description: "REST-api for back-end of e-prescription React app",
  main: "index.js",
};

router.get("/", function (req, res) {
  console.log("Hello from test router");
  res.send(testData);
});

module.exports = router;
