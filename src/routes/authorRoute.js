const { createOne } = require("../controllers/authorController");

const router = require("express").Router();

router.route("/").post(createOne);

module.exports = router;
