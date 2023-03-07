const router = require("express").Router();
const auth = require("../middlewares/auth");
const { CutiControllers } = require("../controllers");

router.route("/").get(auth, CutiControllers.getAllCuti).post(auth, CutiControllers.createCuti);
router.route("/:id").get(auth, CutiControllers.getCuti).patch(auth, CutiControllers.updateCuti).delete(auth, CutiControllers.deleteCuti);

module.exports = router;
