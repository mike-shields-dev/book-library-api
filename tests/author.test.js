const { expect } = require("chai");
const request = require("supertest");
const { Author } = require("../src/models");
const app = require("../src/app");

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
        const newAuthor = { name: "Roald Dahl" };
        const response = await request(app).post("/authors").send(newAuthor);
        const responseAuthor = response.body;

        expect(response.status).to.equal(201);
        expect(responseAuthor.name).to.equal(newAuthor.name);
      });

      it("returns a 400 if name is not provided", async () => {
        const nullNameResponse = await request(app).post("/authors").send({});

        expect(nullNameResponse.status).to.equal(400);
        expect(nullNameResponse.body.error).to.equal("Name must be provided");
      });

      it("returns a 400 response if name is empty", async () => {
        const emptyNameResponse = await request(app).post("/authors").send({
          name: "",
        });

        expect(emptyNameResponse.status).to.equal(400);
        expect(emptyNameResponse.body.error).to.equal("Name cannot be empty");
      });
    });
  });

  describe("with records in the database", async () => {
    const authors = [
      { name: "Roald Dahl" },
      { name: "Jane Austen" },
      { name: "Virginia Woolf" },
    ];

    let dbAuthors;

    before(async () => {
      await Author.sequelize.sync({ force: true });
      dbAuthors = await Promise.all(
        authors.map((author) => Author.create(author))
      );
    });

    describe("POST /authors", () => {
      it("returns a 400 if name is already in the database", async () => {
        const repeatedAuthorResponse = await request(app)
          .post("/authors")
          .send({
            name: "Roald Dahl",
          });

        expect(repeatedAuthorResponse.status).to.equal(400);
        expect(repeatedAuthorResponse.body.error).to.equal(
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
          const responseAuthor = responseAuthors[i];
          Object.keys(dbAuthor.toJSON()).forEach(key => {
            if(["createdAt", "updatedAt"].includes(key)) return;
            
            expect(dbAuthor[key]).to.equal(responseAuthor[key]);
          });
        });
      });
    });

    describe("GET /authors/:id", () => {
      it("returns a single author in the database", async () => {
        const dbAuthor = dbAuthors[0]
        const response = await request(app).get(`/authors/${dbAuthor.id}`);
        const responseAuthor = response.body;

        expect(response.status).to.equal(200);
        
        Object.keys(dbAuthor.toJSON()).forEach(key => {
          if(["createdAt", "updatedAt"].includes(key)) return;

          expect(dbAuthor[key]).to.equal(responseAuthor[key]);
        })
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
