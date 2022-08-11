const { Reader } = require("../models");

module.exports.create = async (req, res) => {
    const newReader = await Reader.create(req.body);
    res.status(201).send(newReader);
}