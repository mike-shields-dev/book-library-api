const { Book } = require('../models');
const { createItem, readAllItems, readOneItem, updateOneItem, deleteOneItem } = require('../utils/modelHelpers');

exports.createOne = (req, res) => createItem(req, res, Book);
exports.readAll = (req, res) => readAllItems(req, res, Book);
exports.readOne = (req, res) => readOneItem(req, res, Book);
exports.updateOne = (req, res) => updateOneItem(req, res, Book);
exports.deleteOne = (req, res) => deleteOneItem(req, res, Book);