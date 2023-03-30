const db = require(`${__dirname}/../db/connection.js`);
const { app } = require(`${__dirname}/../src/app.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const request = require("supertest");
const {
  checkRowExists,
} = require(`${__dirname}/../src/models/checkRowExists.model.js`);
const apiJson = require(`${__dirname}/../endpoints.json`);
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

describe("GET Paths", () => {
  describe("GET /api", () => {
    it("200; Responds with JSON object containing endpoints as keys and their functionality described within an object on that key", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { paths } = body;
          expect(paths).toBeObject();
          expect(paths).toEqual(apiJson);
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
  describe("GET /api/reviews", () => {
    it('200: Responds with array of review objects each with a comment_count key/value in DESC date order"', () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          // console.log(body);

          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(10);
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
          expect(body.total_count).toBe("13");
        });
    });
    describe("GET /api/reviews?", () => {
      describe("Query category=", () => {
        it("200: Should respond with array of reviews with matching category only", () => {
          return request(app)
            .get("/api/reviews?category=dexterity")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toBeArray();
              expect(reviews).toHaveLength(1);
              reviews.forEach((review) => {
                expect(review.category).toBe("dexterity");
              });
            });
        });
        it("200: Should respond with an empty array when passed a valid existing category and no reviews reference that category ", () => {
          return request(app)
            .get("/api/reviews?category=children's games")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toEqual([]);
              expect(body.total_count).toBe("13");
            });
        });
        it("404: should respond 404 Not Found when given a category that doesnt exist", () => {
          return request(app)
            .get("/api/reviews?category=TEST")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("404 Not Found");
            });
        });
      });
      describe("Query sort_by=", () => {
        it("200: Should respond with array of all reviews sorted by and valid column passed as query", () => {
          return request(app)
            .get("/api/reviews?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toBeArray();
              expect(reviews).toHaveLength(10);
              expect(reviews).toBeSortedBy("votes", { descending: true });
            });
        });
        it("400: Responds invalid Query when any non-greenlisted values are used to sort by", () => {
          return request(app)
            .get("/api/reviews?sort_by=SQLINJECTION")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400 Invalid Query");
            });
        });
      });
      describe("Query order=", () => {
        it("200: Responds with array of all objects in ascending or descending created_at depending on passed query", () => {
          return request(app)
            .get("/api/reviews?order=asc")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toBeArray();
              expect(reviews).toHaveLength(10);
              expect(reviews).toBeSortedBy("created_at");
            });
        });
        it("400: Responds Invalid Query when queried with non-greenlisted value for order", () => {
          return request(app)
            .get("/api/reviews?order=SQLINJECTION")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("400 Invalid Query");
            });
        });
      });
      describe("Query limit=", () => {
        it("200: Should respond with array of reviews of length === limit, with a default of 10", () => {
          return request(app)
            .get("/api/reviews?limit=5")
            .expect(200)
            .then(({ body: { reviews } }) => {
              expect(reviews).toBeArray();
              expect(reviews).toHaveLength(5);
            });
        });
        it("400: Responds bad request when passed invalid data type for limit", () => {
          return request(app)
            .get("/api/reviews?limit=stringtype")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Invalid Query");
            });
        });
      });
      describe("Query p=", () => {
        it('200: Responds with correct "page" of review objects ', () => {
          return request(app)
            .get("/api/reviews?sort_by=review_id&order=ASC&p=2")
            .expect(200)
            .then(({ body: { reviews } }) => {
              expect(reviews).toBeArray();
              expect(reviews).toHaveLength(3);
              reviews.forEach((review) => {
                expect(review.review_id).toBeGreaterThanOrEqual(11);
              });
            });
        });
        it("400: Responds bad request if value of p is not a valid datatype", () => {
          return request(app)
            .get("/api/reviews?sort_by=review_id&order=ASC&p=stringdatatype")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Invalid Query");
            });
        });
      });
      it("200: Should respond with expected array when given multiple valid queries", () => {
        return request(app)
          .get(
            "/api/reviews?order=asc&sort_by=review_id&category=social deduction&limit=3"
          )
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toBeArray();
            expect(reviews).toHaveLength(3);
            expect(reviews).toBeSortedBy("review_id");
            reviews.forEach((review) => {
              expect(review.category).toBe("social deduction");
            });
            expect(body.total_count).toBe("13");
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
            comment_count: "3",
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
  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: Responds with array of comment objects relating to given review_id in DESC date order", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeArray();
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 2,
            });
          });
        });
    });
    it("200: Responds with an empty array if a valid review_id is given that has no associated comments in the database ", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    it("400: Responds with Bad Request when given an invalid review_id (wrong data type)", () => {
      return request(app)
        .get("/api/reviews/stringtype/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400 Bad Request");
        });
    });
    it("404: Responds with review not found when given a valid review_id that doesnt exist", () => {
      return request(app)
        .get("/api/reviews/0/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });
    describe("GET /api/reviews/:review_id/comments?", () => {
      describe("Query limit=", () => {
        it("200: Responds with array of comments of length === limit, with a default of 10", () => {
          return request(app)
            .get("/api/reviews/2/comments?limit=2")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeArray();
              expect(comments).toHaveLength(2);
            });
        });
        it("400: Responds Invalid Query if limit is not accepted data type", () => {
          return request(app)
            .get("/api/reviews/2/comments?limit=stringdatatype")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Invalid Query");
            });
        });
      });
      describe("Query p=", () => {
        it('200: Responds with correct "page" of comment objects ', () => {
          return request(app)
            .get("/api/reviews/2/comments?p=2&limit=1")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeArray();
              expect(comments).toHaveLength(1);
              expect(comments[0].comment_id).toBe(1);
            });
        });
        it("400: Responds Invalid Query if p is not accepted data type", () => {
          return request(app)
            .get("/api/reviews/2/comments?p=stringdatatype")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("400 Invalid Query");
            });
        });
      });
    });
  });
  describe("GET /api/users", () => {
    it("200: Should respond with an array of all user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;

          expect(users).toBeArray();
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
  describe("GET /api/users/:username", () => {
    it("200: Should respond with a user object of matching username", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "mallionaire",
            name: "haz",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    it("404: responds not found when given an invalid username", () => {
      return request(app)
        .get("/api/users/MrNobody")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 Not Found");
        });
    });
  });
});

describe("POST Paths", () => {
  describe("POST /api/reviews/:review_id/comments", () => {
    it("201: responds with posted comment object", () => {
      const commentToPost = {
        username: "mallionaire",
        body: "Test Comment For Testing Purposes",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(commentToPost)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toEqual({
            comment_id: 7,
            body: "Test Comment For Testing Purposes",
            review_id: 1,
            author: "mallionaire",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    it("400: Responds bad request when given a malformed post object (missing necessary values)", () => {
      const commentToPost = {};
      return request(app)
        .post("/api/reviews/1/comments")
        .send(commentToPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "400 Bad Request. null value violates not-null constraint"
          );
        });
    });
    it("400: Responds bad request when trying to post to an invalid review_id (wrong data type) ", () => {
      const commentToPost = {
        username: "mallionaire",
        body: "Test Comment For Testing Purposes",
      };
      return request(app)
        .post("/api/reviews/stringtype/comments")
        .send(commentToPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400 Bad Request");
        });
    });
    it("404: responds not found when post object contains an unrecognised username", () => {
      const commentToPost = {
        username: "TESTUSER",
        body: "Test Comment For Testing Purposes",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(commentToPost)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });
    it("404: Responds not found when trying to post to a valid review_id that doesnt exist yet", () => {
      const commentToPost = {
        username: "mallionaire",
        body: "Test Comment For Testing Purposes",
      };
      return request(app)
        .post("/api/reviews/99/comments")
        .send(commentToPost)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });
  });
  describe("POST /api/reviews", () => {
    it("201: Responds with posted review object", () => {
      const postObj = {
        title: "POST TITLE",
        category: "dexterity",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_body: "BODY OF POST",
        review_img_url: "IMG URL, DEFAULTS IF NOT PROVIDED",
      };
      return request(app)
        .post("/api/reviews")
        .send(postObj)
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toBeObject();
          expect(review).toMatchObject({
            review_id: 14,
            title: "POST TITLE",
            category: "dexterity",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "BODY OF POST",
            review_img_url: "IMG URL, DEFAULTS IF NOT PROVIDED",
            created_at: expect.any(String),
            votes: 0,
            comment_count: "0",
          });
        });
    });
    it("400: Responds bad request when post object is missing necessary values", () => {
      return request(app)
        .post("/api/reviews")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "400 Bad Request. null value violates not-null constraint"
          );
        });
    });
    it("404: responds not found when post object contains unrecognised category", () => {
      const postObj = {
        title: "POST TITLE",
        category: "Crab Battler",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_body: "BODY OF POST",
        review_img_url: "IMG URL, DEFAULTS IF NOT PROVIDED",
      };
      return request(app)
        .post("/api/reviews")
        .send(postObj)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 Not Found");
        });
    });
    it("404: responds not found when post object contains unrecognised username", () => {
      const postObj = {
        title: "POST TITLE",
        category: "dexterity",
        designer: "Uwe Rosenberg",
        owner: "MrNobody",
        review_body: "BODY OF POST",
        review_img_url: "IMG URL, DEFAULTS IF NOT PROVIDED",
      };
      return request(app)
        .post("/api/reviews")
        .send(postObj)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 Not Found");
        });
    });
  });
  describe("POST /api/categories", () => {
    it("201: Responds with newly created category object", () => {
      const postObj = {
        slug: "Test Category",
        description: "Test Description",
      };
      return request(app)
        .post("/api/categories")
        .send(postObj)
        .expect(201)
        .then(({ body: { category } }) => {
          expect(category).toBeObject();
          expect(category).toEqual(postObj);
        });
    });
    it("400: Responds bad request when post is missing required fields", () => {
      return request(app)
        .post("/api/categories")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "400 Bad Request. null value violates not-null constraint"
          );
        });
    });
    it("400: Responds bad request if supplied with slug that already exists in the database", () => {
      const postObj = {
        slug: "dexterity",
        description: "Test Description",
      };
      return request(app)
        .post("/api/categories")
        .send(postObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "400 Bad Request. duplicate key value violates unique constraint"
          );
        });
    });
  });
});

describe("PATCH Paths", () => {
  describe("PATCH /api/reviews/:review_id", () => {
    it("200: Responds with updated review object, with votes correctly incremented", () => {
      const patchObj = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/1")
        .send(patchObj)
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toMatchObject({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 11,
          });
        });
    });
    it("400: Responds bad request when given a malformed object (missing values)", () => {
      const patchObj = {};
      return request(app)
        .patch("/api/reviews/1")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "400 Bad Request. null value violates not-null constraint"
          );
        });
    });
    it("400: responds bad request when given malformed object (wrong data type for values)", () => {
      const patchObj = { inc_vote: "Im a string" };
      return request(app)
        .patch("/api/reviews/1")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "400 Bad Request. null value violates not-null constraint"
          );
        });
    });
    it("400: responds bad request when given an invalid review_id (wrong data type)", () => {
      const patchObj = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/stringtype")
        .send(patchObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400 Bad Request");
        });
    });
    it("404: responds not found when given a valid review_id that doesnt exist yet", () => {
      const patchObj = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/0")
        .send(patchObj)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    it("200: Responds with comment object, with votes incremented by the request value", () => {
      const patchObj = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/1")
        .send(patchObj)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toBeObject();
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "I loved this game too!",
            review_id: 2,
            author: "bainesface",
            votes: 26,
            created_at: "2017-11-22T12:43:33.389Z",
          });
        });
    });
    it("400: Responds bad request if request is missing required values", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "400 Bad Request. null value violates not-null constraint"
          );
        });
    });
    it("400: Responds bad request when request value is incorrect data type", () => {
      const patchObj = { inc_votes: "The Number Ten" };
      return request(app)
        .patch("/api/comments/1")
        .send(patchObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 Bad Request");
        });
    });
    it("400: Responds bad request when comment_id given is invalid (wrong data type)", () => {
      const patchObj = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/stringdatatype")
        .send(patchObj)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400 Bad Request");
        });
    });
    it("404: Responds not found when comment_id is valid but does not yet exist", () => {
      const patchObj = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/0")
        .send(patchObj)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 Not Found");
        });
    });
  });
});

describe("DELETE Paths", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    it("204: Should respond with no content and delete comment with given comment_id from db", () => {
      return request(app).delete("/api/comments/6").expect(204);
    });
    it("400: should respond 400 bad request when given an invalid comment_id (wrong datatype)", () => {
      return request(app)
        .delete("/api/comments/stringtype")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400 Bad Request");
        });
    });
    it("404: Should respond 404 Not Found when given a valid comment_id that doesnt exist yet", () => {
      return request(app)
        .delete("/api/comments/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });
  });
});
