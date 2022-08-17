const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const newReader = {
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
          password: "12345678",
        };
        const response = await request(app).post("/readers").send(newReader);
        const responseReader = response.body;
        const dbReader = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(responseReader).not.to.have.property("password");

        const ignoredKeys = ["id", "createdAt", "updatedAt", "password"];
        Object.keys(dbReader).forEach((key) => {
          if (ignoredKeys.includes(key)) return;
          expect(dbReader[key]).to.equal(newReader[key]);
          expect(dbReader[key]).to.equal(responseReader[key]);
        });
      });

      it("returns a 400 error if the password length is too short", async () => {
        const response = await request(app).post("/readers").send({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
          password: "1234567",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "Validation error: Password must be at least 8 characters long"
        );
      });
    });
  });

  describe("with records in the database", () => {
    let existingReaders;

    beforeEach(async () => {
      existingReaders = await Promise.all([
        Reader.create({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
          password: "password",
        }),
        Reader.create({
          name: "Arya Stark",
          email: "vmorgul@me.com",
          password: "password",
        }),
        Reader.create({
          name: "Lyra Belacqua",
          email: "darknorth123@msn.org",
          password: "password",
        }),
      ]);
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers");
        const responseReaders = response.body;

        expect(response.status).to.equal(200);
        expect(responseReaders.length).to.equal(existingReaders.length);

        responseReaders.forEach((responseReader, i) => {
          expect(responseReader).not.to.have.property("password");

          const existingReader = existingReaders.find(
            (existingReader) => existingReader.id === responseReader.id
          ).get();

          const ignoredKeys = ["createdAt", "updatedAt", "password"];
          Object.keys(existingReader).forEach((key) => {
            if (ignoredKeys.includes(key)) return;

            expect(existingReader[key]).to.equal(responseReader[key]);
          });
        });
      });
    });

    describe("GET /readers/:id", () => {
      it("gets readers record by id", async () => {
        const existingReader = existingReaders[0];
        const response = await request(app).get(`/readers/${existingReader.id}`);
        const responseReader = response.body;

        expect(response.status).to.equal(200);
        expect(responseReader).not.to.have.property("password");

        Object.keys(responseReader).forEach((key) => {
          if (["createdAt", "updatedAt"].includes(key)) return;

          expect(responseReader[key]).to.equal(existingReader[key]);
        });
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).get("/readers/12345");
        const errorMsg = response.body.error;
        expect(response.status).to.equal(404);
        expect(errorMsg).to.equal("Reader not found");
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates readers email by id", async () => {
        const reader = existingReaders[0];
        const email = "miss_e_bennet@gmail.com";
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email });
        const updatedReaderRecord = await Reader.findByPk(reader.id);

        expect(response.status).to.equal(200);
        expect(response.body).not.to.have.property("password");
        expect(updatedReaderRecord.email).to.equal(email);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app)
          .patch("/readers/12345")
          .send({ email: "some_new_email@gmail.com" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      });
    });

    describe("DELETE /readers/:id", () => {
      it("deletes reader record by id", async () => {
        const reader = existingReaders[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id);

        expect(response.status).to.equal(204);
        expect(response.body).to.be.empty;
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if the reader is not found", async () => {
        const response = await request(app).delete("/readers/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Reader not found");
      });
    });
  });
});
