const router = require("express").Router();
const {
  createOne,
  readOne,
  readAll,
  updateOne,
  deleteOne,
} = require("../controllers/readerController");

router
  .post("/", createOne)
  .get("/", readAll)
  .get("/:id", readOne)
  .patch("/:id", updateOne)
  .delete("/:id", deleteOne);

module.exports = router;
