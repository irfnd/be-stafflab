const router = require("express").Router();
const { NotFound } = require("../controllers");

router.use("/", NotFound.allMethods);

module.exports = router;
