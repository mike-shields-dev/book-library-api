const { Author } = require("../models");
const {
  createItem,
  readAllItems,
  readOneItem,
  updateOneItem,
  deleteOneItem,
} = require("../utils/modelHelpers");

exports.createOne = (req, res) => createItem(req, res, Author);
exports.readAll = (req, res) => readAllItems(req, res, Author);
exports.readOne = (req, res) => readOneItem(req, res, Author);
exports.updateOne = (req, res) => updateOneItem(req, res, Author);
exports.deleteOne = (req, res) => deleteOneItem(req, res, Author);
