const router = require("express").Router();
const auth = require("../middlewares/auth");
const { InstansiControllers } = require("../controllers");

router.route("/").get(auth, InstansiControllers.getAllInstansi).post(auth, InstansiControllers.createInstansi);

router
	.route("/:id")
	.get(auth, InstansiControllers.getInstansi)
	.patch(auth, InstansiControllers.updateInstansi)
	.delete(auth, InstansiControllers.deleteInstansi);

module.exports = router;
