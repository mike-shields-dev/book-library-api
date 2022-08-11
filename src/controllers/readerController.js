const { Reader } = require("../models");

module.exports.create = async (req, res) => {
  const newReader = await Reader.create(req.body);
  res.status(201).send(newReader);
};

module.exports.readAll = async (_, res) => {
  const readers = await Reader.findAll();
  res.status(200).send(readers);
};
