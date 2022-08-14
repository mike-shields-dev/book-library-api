const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");
const testReaders = require("./testReaders");

describe("/readers", () => {
  before(async () => {
    await Reader.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const testReader = testReaders[0];
        const response = await request(app).post("/readers").send(testReader);
        const responseReader = response.body;
        const dbReader = await Reader.findByPk(responseReader.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(responseReader.name).to.equal(testReader.name);
        expect(responseReader.email).to.equal(testReader.email);
        expect(dbReader.name).to.equal(responseReader.name);
        expect(dbReader.email).to.equal(responseReader.email);
      });
    });
  });

  describe("with records in the database", () => {
    let dbReaders;

    beforeEach(async () => {
      await Reader.sequelize.sync({ force: true });
      
      dbReaders = await Promise.all(
        testReaders.map(async (newReader) => await Reader.create(newReader))
      );
    });

    describe("GET /readers", () => {
      it("returns all the readers", async () => {
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

    describe("GET /readers/:id", () => {
      it("returns reader by ID", async () => {
        const dbReader = dbReaders[0];
        const response = await request(app).get(`/readers/${dbReader.id}`);
        const responseReader = response.body;

        expect(response.status).to.equal(200);
        expect(responseReader.name).to.equal(dbReader.name);
        expect(responseReader.email).to.equal(dbReader.email);
      });

      it("returns a 404 if reader ID not found", async () => {
        const response = await request(app).get("/readers/999999");
        
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates reader field by ID", async () => {
        const dbReader = dbReaders[0];
        const payload = { email: "miss_e_bennet@gmail.com" };
        const response = await request(app)
          .patch(`/readers/${dbReader.id}`)
          .send(payload);

        const updatedDbReader = await Reader.findByPk(dbReader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedDbReader.email).to.equal(payload.email);
      });

      it("returns a 404 if reader ID not found", async () => {
        const response = await request(app).patch(`/readers/999999`).send({});

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      })
    });

    describe("DELETE readers/:id", () => {
      it("deletes reader by ID", async () => {
        const dbReader = dbReaders[0];
        const response = await request(app).delete(`/readers/${dbReader.id}`);
        const foundDbReader = await Reader.findByPk(dbReader.id);
        
        expect(response.status).to.equal(204);
        expect(foundDbReader).to.equal(null);
      });

      it("returns a 404 if reader ID not found", async () => {
        const response = await request(app).delete(`/readers/999999`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      });
    });
  });
});
