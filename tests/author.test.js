const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const { Author } = require("../src/models");
const { testAuthors } = require("./testData");

describe("/authors", () => {
  before(async () => {
    await Author.sequelize.sync({ force: true });
  });

  describe("with no records in the database", () => {
    beforeEach(async () => {
      await Author.destroy({ where: {} });
    });

    describe("POST /authors", () => {
      it("creates a new author in the database", async () => {
        const newAuthor = testAuthors[0];
        const response = await request(app).post("/authors").send(newAuthor);
        const responseAuthor = response.body;

        expect(response.status).to.equal(201);
        expect(responseAuthor.name).to.equal(newAuthor.name);
      });

      it("returns a 400 if name fails validation", async () => {
        const nullNameResponse = await request(app).post("/authors").send({});
        const emptyNameResponse = await request(app).post("/authors").send({
          name: "",
        });

        expect(nullNameResponse.status).to.equal(400);
        expect(nullNameResponse.body.error).to.equal("Name must be provided");

        expect(emptyNameResponse.status).to.equal(400);
        expect(emptyNameResponse.body.error).to.equal("Name cannot be empty");
      });
    });
  });

  describe("with records in the database", async () => {
    let dbAuthors;

    before(async () => {
      await Author.sequelize.sync({ force: true });
      dbAuthors = await Author.bulkCreate(testAuthors);
    });

    describe("POST /authors", () => {
      it("returns a 400 if name is already in the database", async () => {
        const duplicateAuthorResponse = await request(app)
          .post("/authors")
          .send(testAuthors[0]);

        expect(duplicateAuthorResponse.status).to.equal(400);
        expect(duplicateAuthorResponse.body.error).to.equal(
          "Name already exists"
        );
      });
    });

    describe("GET /authors", () => {
      it("returns all authors in the database", async () => {
        const response = await request(app).get("/authors");
        const responseAuthors = response.body;

        expect(response.status).to.equal(200);
        expect(responseAuthors.length).to.equal(dbAuthors.length);

        dbAuthors.forEach((dbAuthor, i) => {
          const responseAuthor = responseAuthors[i]
          expect(dbAuthor.name).to.equal(responseAuthor.name);
        });
      });
    });

    describe("GET /authors/:id", () => {
      it("returns a single author in the database", async () => {
        const dbAuthor = dbAuthors[0]
        const response = await request(app).get(`/authors/${dbAuthor.id}`);
        const responseAuthor = response.body;

        expect(response.status).to.equal(200);
        expect(dbAuthor.name).to.equal(responseAuthor.name);
      
      });

      it("returns a 404 if author is not found", async () => {
        const response = await request(app).get(`/authors/${dbAuthors.length + 1}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Author not found");
      });
    });

    describe("PATCH /authors/:id", () => {
      it("updates an author in the database", async () => {
        const dbAuthor = dbAuthors[0];
        const updatedAuthor = { name: "Charles Dickens" };
        const response = await request(app)
          .patch(`/authors/${dbAuthor.id}`)
          .send(updatedAuthor);
        const responseAuthor = response.body;

        expect(response.status).to.equal(200);
        expect(responseAuthor.name).to.equal(updatedAuthor.name);
      });
    });

    describe("DELETE /authors/:id", () => {
      it("deletes an author by id", async () => {
        const dbAuthor = dbAuthors[0];
        const response = await request(app).delete(`/authors/${dbAuthor.id}`);
        const deletedBookRecord = await Author.findByPk(dbAuthor.id);

        expect(response.status).to.equal(204);
        expect(deletedBookRecord).to.equal(null);
      });

      it("returns a 404 if the author is not found", async () => {
        const response = await request(app).delete(`/authors/${dbAuthors.length + 1}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Author not found");
      });
    });
  });
});
