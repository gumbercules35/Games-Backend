const db = require(`${__dirname}/../db/connection.js`);
const { app } = require(`${__dirname}/../src/app.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

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
        expect(review).toEqual({
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_body: "Fiddly fun for all the family",
          review_id: 2,
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          title: "Jenga",
          votes: 5,
        });
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

describe("GET /api/reviews", () => {
  it('200: Responds with array of review objects each with a comment_count key/value in DESC date order"', () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;

        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });

        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
        expect(reviews[4].comment_count).toBe("3");
      });
  });
});
