const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const { Reader } = require("../src/models");
const { testReaders } = require("./testData");

describe("/readers", () => {
  before(async () => Reader.sequelize.sync({ force: true }));

  describe("with no records in the database", () => {
    beforeEach(async () => {
      await Reader.destroy({ where: {} });
    });

    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const newReader = testReaders[0];
        const response = await request(app).post("/readers").send(newReader);
        const responseReader = response.body;
        const dbReader = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(responseReader).not.to.have.property("password");

        Object.keys(responseReader).forEach((key) => {
          if (["id", "createdAt", "updatedAt"].includes(key)) return;

          expect(responseReader[key]).to.equal(newReader[key]);
        });

        Object.keys(dbReader).forEach((key) => {
          if (["createdAt", "updatedAt", "password"].includes(key)) return;

          expect(dbReader[key]).to.equal(responseReader[key]);
        });
      });

      it("returns a 400 error if the password fails validation", async () => {
        const readerShortPassword = { ...testReaders[0], password: "1234567" };
        const response = await request(app)
          .post("/readers")
          .send(readerShortPassword);

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "Password must be at least 8 characters long"
        );
      });
    });
  });

  describe("with records in the database", () => {
    let dbReaders;

    before(async () => {
      await Reader.sequelize.sync({ force: true });
      dbReaders = await Reader.bulkCreate(testReaders);
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers");
        const responseReaders = response.body;

        expect(response.status).to.equal(200);

        dbReaders.forEach((dbReader) => {
          const matchingResponseReader = responseReaders.find(
            (responseReader) => responseReader.id === dbReader.id
          );

          expect(matchingResponseReader).not.to.have.property("password");

          Object.keys(dbReader.toJSON()).forEach((key) => {
            if (["createdAt", "updatedAt", "password"].includes(key)) return;

            expect(matchingResponseReader[key]).to.equal(dbReader[key]);
          });
        });
      });
    });

    describe("GET /readers/:id", () => {
      it("gets readers record by id", async () => {
        const dbReader = dbReaders[0];
        const response = await request(app).get(`/readers/${dbReader.id}`);

        const responseReader = response.body;

        expect(response.status).to.equal(200);
        expect(responseReader).not.to.have.property("password");

        Object.keys(dbReader.toJSON()).forEach((key) => {
          if (["createdAt", "updatedAt", "password"].includes(key)) return;

          expect(responseReader[key]).to.equal(dbReader[key]);
        });
      });

      it("returns a 404 if the reader does not exist", async () => {
        const nonExistentId = (await Reader.max("id")) + 1;
        const response = await request(app).get(`/readers/${nonExistentId}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates reader by id", async () => {
        const dbReader = dbReaders[0];
        const email = "miss_e_bennet@gmail.com";
        const response = await request(app)
          .patch(`/readers/${dbReader.id}`)
          .send({ email });
        const updatedReaderRecord = await Reader.findByPk(dbReader.id);

        expect(response.status).to.equal(200);
        expect(response.body).not.to.have.property("password");
        expect(updatedReaderRecord.email).to.equal(email);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const nonExistentId = (await Reader.max("id")) + 1;
        const response = await request(app)
          .patch(`/readers/${nonExistentId}`)
          .send({ email: "some_new_email@gmail.com" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      });
    });

    describe("DELETE /readers/:id", () => {
      it("deletes reader record by id", async () => {
        const reader = dbReaders[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReaderRecord = await Reader.findByPk(reader.id);

        expect(response.status).to.equal(204);
        expect(response.body).to.be.empty;
        expect(deletedReaderRecord).to.equal(null);
      });

      it("returns a 404 if the reader is not found", async () => {
        const nonExistentId = (await Reader.max("id")) + 1;
        const response = await request(app).delete(`/readers/${nonExistentId}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      });
    });
  });
});
