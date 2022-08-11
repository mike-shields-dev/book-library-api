const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => {
    await Reader.sequelize.sync();
  });

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {

        const response = await request(app).post("/readers").send({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
        });

        const createdReader = { 
          id: response.body.id, 
          name: response.body.name, 
          email: response.body.email,
        }

        const dbReaderRecord = await Reader.findByPk(createdReader.id, { raw: true })

        expect(response.status).to.equal(201);
        expect(dbReaderRecord.name).to.equal(createdReader.name);
        expect(dbReaderRecord.email).to.equal(createdReader.email);
      });
    });
  });
});
