const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const { Book } = require("../src/models");
const { testBooks } = require("./testData");

describe("/books", () => {
  before(async () => {
    await Book.sequelize.sync({ force: true });
  });

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      beforeEach(async () => {
        await Book.destroy({ where: {} });
      });

      it("creates a new book in the database", async () => {
        const newBook = testBooks[0];
        const response = await request(app).post("/books").send(newBook);
        const createdBook = response.body;

        expect(response.status).to.equal(201);

        console.log(createdBook);

        Object.keys(createdBook).forEach((key) => {
          if (["id", "createdAt", "updatedAt"].includes(key)) return;

          expect(newBook[key]).to.equal(createdBook[key]);
        });
      });

      it("returns a 400 if title does not pass validation", async () => {
        const { title, ...newBookNoTitle } = testBooks[0];
        const newBookEmptyTitle = { ...testBooks[0], title: "" };
        const responseNoTitle = await request(app)
          .post("/books")
          .send(newBookNoTitle);
        const responseEmptyTitle = await request(app)
          .post("/books")
          .send(newBookEmptyTitle);

        expect(responseNoTitle.status).to.equal(400);
        expect(responseNoTitle.body.error).to.equal("Book title must be provided");

        expect(responseEmptyTitle.status).to.equal(400);
        expect(responseEmptyTitle.body.error).to.equal("Book title cannot be empty");
      });

      it("returns a 400 if author does not pass validation", async () => {
        const { author, ...newBookNoAuthor } = testBooks[0];
        const newBookEmptyAuthor = { ...testBooks[0], author: "" };
        const responseNoAuthor = await request(app)
          .post("/books")
          .send(newBookNoAuthor);
        const responseEmptyAuthor = await request(app)
          .post("/books")
          .send(newBookEmptyAuthor);

        expect(responseNoAuthor.status).to.equal(400);
        expect(responseNoAuthor.body.error).to.equal("Book author must be provided");

        expect(responseEmptyAuthor.status).to.equal(400);
        expect(responseEmptyAuthor.body.error).to.equal(
          "Book author cannot be empty"
        );
      });
    });
  });

  describe("with records in the database", () => {
    let dbBooks;
    before(async () => {
      dbBooks = await Book.bulkCreate(testBooks);
    });

    describe("GET /books", () => {
      it("gets all books records", async () => {
        const response = await request(app).get("/books");
        const responseBooks = response.body;

        expect(response.status).to.equal(200);

        dbBooks.forEach((dbBook, i) => {
          const matchingResponseBook = responseBooks.find(
            (responseBook) => responseBook.id === dbBook.id
          );

          Object.keys(dbBook.toJSON()).forEach((key) => {
            if (["createdAt", "updatedAt"].includes(key)) return;

            expect(matchingResponseBook[key]).to.equal(dbBook[key]);
          });
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets a book by id", async () => {
        const dbBook = dbBooks[0];
        const response = await request(app).get(`/books/${dbBook.id}`);
        const responseBook = response.body;

        expect(response.status).to.equal(200);

        Object.keys(dbBook.toJSON()).forEach((key) => {
          if (["createdAt", "updatedAt"].includes(key)) return;

          expect(dbBook[key]).to.equal(responseBook[key]);
        });
      });

      it("returns a 404 if id does not exist", async () => {
        const notExistsId = await Book.max("id") + 1;
        const response = await request(app).get(`/books/${notExistsId}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Book not found");
      });

      it("returns a 400 if id is not a number", async () => {
        const response = await request(app).get(`/books/x`);

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Book id must be a number");
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

      it("returns a 404 if id does not exist", async () => {
        const notExistsId = await Book.max("id") + 1;
        const response = await request(app)
          .patch(`/books/${notExistsId}`)
          .send({ title: "The Lord of the Rings 2" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Book not found");
      });

      it("returns 400 if id is not a number", async () => {
        const response = await request(app).patch(`/books/x`).send({});

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Book id must be a number");
      });
    });

    describe("DELETE /books/:id", () => {
      it("deletes a book record by id", async () => {
        const dbBook = dbBooks[0];
        const response = await request(app).delete(`/books/${dbBook.id}`);
        const deletedBookRecord = await Book.findByPk(dbBook.id);

        expect(response.status).to.equal(204);
        expect(deletedBookRecord).to.equal(null);
      });

      it("returns a 404 if id does not exist", async () => {
        const notExistsId = await Book.max("id") + 1;
        const response = await request(app).delete(`/books/${notExistsId}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Book not found");
      });

      it("returns 400 if id is not a number", async () => {
        const response = await request(app).delete(`/books/x`);

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("Book id must be a number");
      });
    });
  });
});
