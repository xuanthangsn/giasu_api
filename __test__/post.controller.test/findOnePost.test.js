const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("find one post", () => {
  describe("post found", () => {
    it("200 status code", async () => {
      jest.mocked(db.sequelize.query).mockResolvedValue({});
      await supertest(app).get("/api/post/1").expect(200);
    });
  });

  describe("no post found", () => {
    it("404 status code", async () => {
      jest.mocked(db.sequelize.query).mockResolvedValue();

      await supertest(app).get("/api/post/1").expect(404);
    });
  });

  describe("error when try to query", () => {
    it("500 status code", async () => {
      jest.mocked(db.sequelize.query).mockRejectedValue(new Error());

      await supertest(app).get("/api/post/1").expect(500);
    });
  });
});
