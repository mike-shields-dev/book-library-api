const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('/books', () => {
    describe("GET /books", () => {
        it("responds with status code 200", async() => {
            const response = await request(app).get("/books");
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal("Hello World");
        })
    })
})