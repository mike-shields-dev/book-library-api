const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

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

  describe("with records in the database", () => {
    let books;
    beforeEach(async () => {
      books = await Promise.all([
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

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets books record by id", async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it("returns a 404 if the book is not found", async () => {
        const response = await request(app).get("/books/123");

        expect(response.status).to.equal(404);
      });
    });

    describe("PATCH /books/:id", () => {
      it("updates a book record", async () => {
        const book = books[0];
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
        const book = books[0];
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
