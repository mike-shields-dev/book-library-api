const { Router } = require("express");
const readerController = require("../controllers/readerController");

const router = Router();

router.route("/").post(readerController.create).get(readerController.readAll);

module.exports = router;
