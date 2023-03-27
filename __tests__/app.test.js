const db = require(`${__dirname}/../db/connection.js`);
const { app } = require(`${__dirname}/../src/app.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe("GET /api/categories", () => {
  it("200: Should respond with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toBeInstanceOf(Object);
          expect(category).toHaveProperty("slug", expect.any(String));
          expect(category).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("200: Should respond with object matching given review_id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;

        expect(review).toHaveLength(1);
        expect(review[0]).toBeInstanceOf(Object);
        expect(review[0]).toHaveProperty("review_id", 2);
        expect(review[0]).toHaveProperty("title", "Jenga");
        expect(review[0]).toHaveProperty(
          "review_body",
          "Fiddly fun for all the family"
        );
        expect(review[0]).toHaveProperty("designer", "Leslie Scott");
        expect(review[0]).toHaveProperty(
          "review_img_url",
          "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
        );
        expect(review[0]).toHaveProperty("votes", 5);
        expect(review[0]).toHaveProperty("category", "dexterity");
        expect(review[0]).toHaveProperty("owner", "philippaclaire9");
        expect(review[0]).toHaveProperty(
          "created_at",
          "2021-01-18T10:01:41.251Z"
        );
      });
  });
  it("400: Responds with 400 Bad Request when given an invalid review_id (i.e wrong Data type)", () => {
    return request(app)
      .get("/api/reviews/stringdatatype")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  it("404: Responds with 404 Review Not Found when passed a valid review_id that does not exist in the database", () => {
    return request(app)
      .get("/api/reviews/0")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`404 Review Not Found`);
      });
  });
});

describe("Typo 404 Error Handling", () => {
  it("404: reponds page not found when a misspelt path is given", () => {
    return request(app)
      .get("/aip/cass")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Path Not Found");
      });
  });
});
