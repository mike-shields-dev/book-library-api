const router = require("express").Router();
const {
  createOne,
  readOne,
  readAll,
  updateOne,
  deleteOne,
} = require("../controllers/readerController");

router.route("/")
  .post(createOne)
  .get(readAll);

router.route("/:id")
  .get(readOne)
  .patch(updateOne)
  .delete(deleteOne);

module.exports = router;
