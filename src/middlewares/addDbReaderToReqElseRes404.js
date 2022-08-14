const { Reader } = require("../models");

async function addDbReaderToReqElseRes404(req, res, next) {
    const foundDbReader = await Reader.findByPk(req.params.id);
    if (!foundDbReader) {
        return res.status(404).send({ error: "Reader not found" });
      }
    req.foundDbReader = foundDbReader;
    next();
}

module.exports = addDbReaderToReqElseRes404;

