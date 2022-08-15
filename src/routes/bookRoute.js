const router = require("express").Router();

const { createOne, readAll, readOne, updateOne, deleteOne } = require("../controllers/bookController");

router
    .post("/", createOne)
    .get("/", readAll)
    .get("/:id", readOne)
    .patch("/:id", updateOne)
    .delete("/:id", deleteOne);

module.exports = router;

