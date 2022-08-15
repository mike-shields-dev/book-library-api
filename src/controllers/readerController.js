const { Reader } = require("../models");

exports.createOne = async (req, res) => {
  try {
    const newReader = await Reader.create(req.body);
    res.status(201).send(newReader);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.readAll = async (req, res) => {
  const allReaders = await Reader.findAll();
  res.status(200).json(allReaders);
};

exports.readOne = async (req, res) => {
  const reader = await Reader.findByPk(req.params.id);
  if(!reader) {
    return res.status(404).json({ error: 'Reader not found'});
  }
  res.status(200).json(reader);
};

exports.updateOne = async (req, res) => {
  const reader = await Reader.findByPk(req.params.id);
  if(!reader) {
    return res.status(404).json({ error: 'Reader not found'});
  }
  const updatedReader = await reader.update(req.body);
  res.status(200).json(updatedReader);
};

exports.deleteOne = async (req, res) => {
  const reader = await Reader.findByPk(req.params.id);
  if(!reader) {
    return res.status(404).json({ error: 'Reader not found'});
  }
  await reader.destroy();
  res.sendStatus(204);
};
