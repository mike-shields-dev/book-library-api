const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const { Genre } = require("../src/models");
const { testGenres } = require("./testData");

describe("/genres", () => {
  before(async () => {
    await Genre.sequelize.sync({ force: true });
  });

  describe("with no records in the database", () => {
    describe("POST /genres", () => {
      beforeEach(async () => {
        await Genre.destroy({ where: {} });
      });

      it("creates a new genre in the database", async () => {
        const newGenre = testGenres[0];
        const response = await request(app).post("/genres").send(newGenre);
        const responseGenre = response.body;

        expect(response.status).to.equal(201);
        expect(responseGenre.name).to.equal(newGenre.name);
      });

      it("returns a 400 if name does not pass validation", async () => {
        const { name, ...newGenreNoName } = testGenres[0];
        const newGenreEmptyName = { ...testGenres[0], name: "" };
        const responseNoName = await request(app)
          .post("/genres")
          .send(newGenreNoName);
        const responseEmptyName = await request(app)
          .post("/genres")
          .send(newGenreEmptyName);

        expect(responseNoName.status).to.equal(400);
        expect(responseNoName.body.error).to.equal(
          "Genre name must be provided"
        );

        expect(responseEmptyName.status).to.equal(400);
        expect(responseEmptyName.body.error).to.equal(
          "Genre name cannot be empty"
        );
      });
    });
  });

  describe("with records in the database", () => {
    let dbGenres;

    before(async () => {
      await Genre.sequelize.sync({ force: true });
      dbGenres = await Genre.bulkCreate(testGenres);
    });
    
    describe("POST /genres", () => {
      it("returns a 400 if name is already in the database", async () => {
        const responseDuplicateGenre = await request(app)
          .post("/genres")
          .send(testGenres[0]);

        expect(responseDuplicateGenre.status).to.equal(400);
        expect(responseDuplicateGenre.body.error).to.equal(
          "Genre name already exists"
        );
      });
    });

    describe("GET /genres", () => {
      it("gets all genres in the database", async () => {
        const response = await request(app).get("/genres");
        const responseGenres = response.body;

        expect(response.status).to.equal(200);

        dbGenres.forEach(dbGenre => {
          const matchingResponseGenre = responseGenres.find(
            responseGenre => responseGenre.id === dbGenre.id
          );

          expect(matchingResponseGenre.name).to.equal(dbGenre.name);
        })
      });
    });

    describe("GET /genres/:id", () => {
      it("gets a genre by id", async () => {
        const dbGenre = dbGenres[0];
        const response = await request(app).get(`/genres/${dbGenre.id}`);
        const responseGenre = response.body;

        expect(response.status).to.equal(200);
        expect(responseGenre.name).to.equal(dbGenre.name);
      });

      it("returns a 404 if id does not exist", async () => {
        const nonExistentGenreId = await Genre.max("id") + 1;
        const response = await request(app).get(`/genres/${nonExistentGenreId}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Genre not found");
      });

      it("returns a 400 if id is not a number", async () => {
        const response = await request(app).get("/genres/x");

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("id must be a number");
      });
    });

    describe("PATCH /genres/:id", () => {
      it("updates a genre by id", async () => {
        const dbGenre = dbGenres[0];
        const newGenre = { name: "Horror" };
        const response = await request(app)
          .patch(`/genres/${dbGenre.id}`)
          .send(newGenre);
        const responseGenre = response.body;

        expect(response.status).to.equal(200);
        expect(responseGenre.name).to.equal(newGenre.name);
      }),

      it("returns a 404 if id does not exist", async () => {
        const nonExistentGenreId = await Genre.max("id") + 1;
        const response = await request(app)
          .patch(`/genres/${nonExistentGenreId}`)
          .send({ name: "New Genre" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Genre not found");
      });

      it("returns a 400 if id is not a number", async () => {
        const response = await request(app).patch("/genres/x");

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("id must be a number");
      });
    });

    describe("DELETE /genres/:id", () => {
      it("deletes a genre by id", async () => {
        const dbGenre = dbGenres[0];
        const response = await request(app).delete(`/genres/${dbGenre.id}`);

        expect(response.status).to.equal(204);
      });

      it("returns a 404 if id does not exist", async () => {
        const nonExistentGenreId = await Genre.max("id") + 1;
        const response = await request(app).delete(`/genres/${nonExistentGenreId}`);

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("Genre not found");
      });

      it("returns a 400 if id is not a number", async () => {
        const response = await request(app).delete("/genres/x");

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal("id must be a number");
      });
    });
  });
});
