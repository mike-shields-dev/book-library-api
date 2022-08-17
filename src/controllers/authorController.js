const { Author } = require("../models");
const { createItem, readAllItems, readOneItem, updateOneItem, deleteOneItem } = require('../utils/modelHelpers')

exports.createOne = (req, res) => createItem(req, res, Author);