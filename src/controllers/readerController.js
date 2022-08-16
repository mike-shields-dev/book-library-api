const { Reader } = require("../models");

const { createItem, readAllItems, readOneItem, updateOneItem, deleteOneItem } = require('../utils/modelHelpers');

exports.createOne = (req, res) => createItem(req, res, Reader);
exports.readAll = (req, res) => readAllItems(req, res, Reader, "Reader");
exports.readOne = (req, res) => readOneItem(req, res, Reader, "Reader");
exports.updateOne = (req, res) => updateOneItem(req, res, Reader, "Reader");
exports.deleteOne = (req, res) => deleteOneItem(req, res, Reader, "Reader");