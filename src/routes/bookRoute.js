const router = require("express").Router();

const { createOne, readAll } = require("../controllers/bookController");

router
    .post("/", createOne)
    .get("/", readAll)

module.exports = router;

