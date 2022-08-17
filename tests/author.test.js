const { expect } = require("chai");
const request = require("supertest");
const { Author } = require("../src/models");
const app = require("../src/app");

describe("/authors", () => {
  before(async () => Author.sequelize.sync());

  beforeEach(async () => {
    await Author.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /authors", () => {
      it("creates a new author in the database", async () => {
        const newAuthor = {
          name: "Roald Dahl"
        }

        const response = await request(app).post("/authors").send(newAuthor);
        const responseAuthor = response.body;
      });
    });
  })
});
