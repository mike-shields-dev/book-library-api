const { Book } = require('../models');
const { createItem, readAllItems, readOneItem, updateOneItem, deleteOneItem } = require('../utils/helpers');

exports.createOne = (req, res) => createItem(req, res, Book);
exports.readAll = (req, res) => readAllItems(req, res, Book, "Book");
exports.readOne = (req, res) => readOneItem(req, res, Book, "Book");
exports.updateOne = (req, res) => updateOneItem(req, res, Book, "Book");
exports.deleteOne = (req, res) => deleteOneItem(req, res, Book, "Book");