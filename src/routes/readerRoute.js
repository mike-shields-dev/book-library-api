const { Router } = require("express");
const router = Router();
const addDbReaderToReqElseRes404 = require("../middlewares/addDbReaderToReqElseRes404");
const {
  createOne,
  readOne,
  readAll,
  updateOne,
  deleteOne,
} = require("../controllers/readerController");

router
  .post("/", createOne)
  .get("/:id", addDbReaderToReqElseRes404, readOne)
  .get("/", readAll)
  .patch("/:id", addDbReaderToReqElseRes404, updateOne)
  .delete("/:id", addDbReaderToReqElseRes404, deleteOne);

module.exports = router;
