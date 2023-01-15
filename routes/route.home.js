const router = require("express").Router();
const { Home } = require("../controllers");

router.get("/", Home.getHome);

module.exports = router;
