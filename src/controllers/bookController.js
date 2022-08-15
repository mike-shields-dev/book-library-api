const { Book } = require('../models');
const { createItem } = require('../utils/helpers');

exports.createOne = async (req, res) => await createItem(req, res, Book);

exports.readAll = async (req, res) => {
    const allBooks = await Book.findAll();
    res.status(200).json(allBooks);
}

exports.readOne = async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(!book) {
        return res.status(404).json({ error: 'Book not found'});
    }
    res.status(200).json(book);
}

exports.updateOne = async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(!book) {
        return res.status(404).json({ error: 'Book not found'});
    }
    const updatedBook = await book.update(req.body);
    res.status(200).json(updatedBook);
}


exports.deleteOne = async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(!book) {
        return res.status(404).json({ error: 'Book not found'});
    }
    await book.destroy();
    res.sendStatus(204);
}