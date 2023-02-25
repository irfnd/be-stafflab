const router = require("express").Router();
const { NotFoundControllers } = require("../controllers");

router.use("/", NotFoundControllers.allMethods);

module.exports = router;
