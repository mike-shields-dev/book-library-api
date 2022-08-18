const router = require("express").Router();

const {
  createOne,
  readAll,
  readOne,
  updateOne,
  deleteOne,
} = require("../controllers/authorController");

router.route("/")
  .post(createOne)
  .get(readAll);

router.route("/:id")
  .get(readOne)
  .patch(updateOne)
  .delete(deleteOne);

module.exports = router;
