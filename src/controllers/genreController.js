const { Genre } = require("../models");
const {
  createItem,
  readAllItems,
  readOneItem,
  updateOneItem,
  deleteOneItem,
} = require("../utils/modelHelpers");

exports.createOne = (req, res) => createItem(req, res, Genre);
exports.readAll = (req, res) => readAllItems(req, res, Genre);
exports.readOne = (req, res) => readOneItem(req, res, Genre);
exports.updateOne = (req, res) => updateOneItem(req, res, Genre);
exports.deleteOne = (req, res) => deleteOneItem(req, res, Genre);
