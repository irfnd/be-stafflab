const router = require("express").Router();
const auth = require("../middlewares/auth");
const { PendidikanControllers } = require("../controllers");

router.route("/").get(auth, PendidikanControllers.getAllPendidikan).post(auth, PendidikanControllers.createPendidikan);
router.route("/:id").patch(auth, PendidikanControllers.updatePendidikan).delete(auth, PendidikanControllers.deletePendidikan);

module.exports = router;
