const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");
const newReaders = require("./testReaders");

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
        const newReader = newReaders[0];

        const response = await request(app).post("/readers").send(newReader);

        const responseReader = response.body;

        const dbReader = await Reader.findByPk(responseReader.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);

        expect(responseReader.name).to.equal(newReader.name);
        expect(responseReader.email).to.equal(newReader.email);

        expect(dbReader.name).to.equal(responseReader.name);
        expect(dbReader.email).to.equal(responseReader.email);
      });
    });
  });

  describe("with records in the database", () => {
    let dbReaders;

    beforeEach(async () => {
      dbReaders = await Promise.all(
        newReaders.map(async (newReader) => await Reader.create(newReader))
      );
    });

    describe("GET /readers", () => {
      it("returns all the readers in the database", async () => {
        const response = await request(app).get("/readers");
        const responseReaders = response.body;

        expect(response.status).to.equal(200);
        expect(responseReaders.length).to.equal(dbReaders.length);

        responseReaders.forEach((responseReader) => {
          const dbReader = dbReaders.find(
            (dbReader) => dbReader.id === responseReader.id
          );

          expect(responseReader.name).to.equal(dbReader.name);
          expect(responseReader.email).to.equal(dbReader.email);
        });
      });
    });
  });
});
