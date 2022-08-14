const { Book } = require('../models/');

exports.createOne = async (req, res) => {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
}

exports.readAll = async (req, res) => {
    res.sendStatus(200);
}
