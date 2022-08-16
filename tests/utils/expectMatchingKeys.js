const { expect } = require("chai");

module.exports = (oA, oB) => {
  Object.keys(oA)
    .filter((key) => !["id", "createdAt", "updatedAt"].includes(key))
    .forEach((key) => expect(oA[key]).to.equal(oB[key]));
}
