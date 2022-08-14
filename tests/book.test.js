const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          ISBN: "978-0-395-19395-8",
        });
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal("The Lord of the Rings");
        expect(response.body.author).to.equal("J.R.R. Tolkien");
        expect(response.body.genre).to.equal("Fantasy");
        expect(response.body.ISBN).to.equal("978-0-395-19395-8");
      });
    });
  });

  describe("/books", () => {
    describe("GET /books", () => {
      it("responds with status code 200", async () => {
        const response = await request(app).get("/books");
        expect(response.status).to.equal(200);
      });
    });
  });
});
