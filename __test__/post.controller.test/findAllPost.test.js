const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("find all post", () => {
  describe("find some post", () => {
    it("200 status code", async () => {
        jest.mocked(db.Post.findAll).mockResolvedValue(['post1', 'post2']);


      await supertest(app).get("/api/post/").expect(200);
    });
  });

  describe("no post found", () => {
    it("404 status code", async () => {
        jest.mocked(db.Post.findAll).mockResolvedValue();

      await supertest(app).get("/api/post/").expect(404);
    });
  });

  describe("error when try to query", () => {
    it("500 status code", async () => {
        jest.mocked(db.Post.findAll).mockRejectedValue(new Error());

      await supertest(app).get("/api/post/").expect(500);
    });
  });
});
