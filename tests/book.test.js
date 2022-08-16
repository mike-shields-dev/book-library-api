const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");
const expectMatchingKeys = require('./utils/expectMatchingKeys');

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const newBook = {
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          ISBN: "978-0-395-19395-8",
        };
        const response = await request(app).post("/books").send(newBook);
        const createdBook = response.body;

        expect(response.status).to.equal(201);
        expectMatchingKeys(createdBook, newBook);
      });

      it("returns a 400 if title is not provided", async () => {
        const response = await request(app).post("/books").send({
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          ISBN: "978-0-395-19395-8",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "notNull Violation: Book.title cannot be null"
        );
      });

      it("returns a 400 if author is not provided", async () => {
        const response = await request(app).post("/books").send({
          title: "The Lord of the Rings",
          genre: "Fantasy",
          ISBN: "978-0-395-19395-8",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "notNull Violation: Book.author cannot be null"
        );
      });
    });
  });

  describe("with records in the database", () => {
    let dbBooks;
    beforeEach(async () => {
      dbBooks = await Promise.all([
        Book.create({
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          ISBN: "978-0-395-19395-8",
        }),
        Book.create({
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          ISBN: "978-0-395-19395-8",
        }),
        Book.create({
          title: "The Fellowship of the Ring",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          ISBN: "978-0-395-19395-8",
        }),
      ]);
    });

    describe("GET /books", () => {
      it("gets all books records", async () => {
        const response = await request(app).get("/books");
        const resBooks = response.body;

        expect(response.status).to.equal(200);
        expect(resBooks.length).to.equal(dbBooks.length);

        resBooks.forEach((resBook) => {
          const {dataValues: matchBook} = dbBooks.find((dbBook) => dbBook.id === resBook.id);
          expectMatchingKeys(matchBook, resBook);
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets books record by id", async () => {
        const {dataValues : dbBook} = dbBooks[0];
        const response = await request(app).get(`/books/${dbBook.id}`);
        const resBook = response.body;

        expect(response.status).to.equal(200);
        expectMatchingKeys(dbBook, resBook);
      });

      it("returns a 404 if the book is not found", async () => {
        const response = await request(app).get("/books/123");

        expect(response.status).to.equal(404);
      });
    });

    describe("PATCH /books/:id", () => {
      it("updates a book record", async () => {
        const book = dbBooks[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: "The Lord of the Rings 2" });

        const updatedBookRecord = await Book.findByPk(book.id);

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.title).to.equal("The Lord of the Rings 2");
      });

      it("returns a 404 if the book is not found", async () => {
        const response = await request(app)
          .patch("/books/123")
          .send({ title: "The Lord of the Rings 2" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Book not found");
      });
    });

    describe("DELETE /books/:id", () => {
      it("deletes a book record by id", async () => {
        const book = dbBooks[0];
        const response = await request(app).delete(`/books/${book.id}`);

        const updatedBookRecord = await Book.findByPk(book.id);

        expect(response.status).to.equal(204);
        expect(updatedBookRecord).to.equal(null);
      });

      it("returns a 404 if the book is not found", async () => {
        const response = await request(app).delete("/books/123");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Book not found");
      });
    });
  });
});
