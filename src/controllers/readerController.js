const { Reader } = require("../models");

// addDbReaderToReqElseRes404 middleware is utilised in readerRouter
// if a reader by ID is found, it is attached to the request object as req.foundDbReader, 
// otherwise a 404 error is returned.

exports.createOne = async (req, res) => {
  const createdDbReader = await Reader.create(req.body);
  res.status(201).send(createdDbReader);
};

exports.readAll = async (req, res) => {
  const allDbReaders = await Reader.findAll();
  res.status(200).send(allDbReaders);
};

exports.readOne = async (req, res) => {
  const foundDbReader = req.foundDbReader
  res.status(200).json(foundDbReader);
};

exports.updateOne = async (req, res) => {
  const foundDbReader = req.foundDbReader;
  const updatedDbReader = await foundDbReader.update(req.body);
  res.status(200).json(updatedDbReader);
};

exports.deleteOne = async (req, res) => {
  const foundDbReader = req.foundDbReader;
  await foundDbReader.destroy();
  res.sendStatus(204);
};
