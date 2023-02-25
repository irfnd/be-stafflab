const router = require("express").Router();
const auth = require("../middlewares/auth");
const { Instansi } = require("../controllers");

router.route("/").get(auth, Instansi.getAllInstansi).post(auth, Instansi.createInstansi);
router.route("/:id").get(auth, Instansi.getInstansi).patch(auth, Instansi.updateInstansi).delete(auth, Instansi.deleteInstansi);

module.exports = router;
