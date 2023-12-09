const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("find all comment", () => {
  describe("no error", () => {
    it("200 status code", async () => {
      jest.mocked(db.Comment.findAll).mockResolvedValue({});

      await supertest(app).get("/api/comment").expect(200);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.Comment.findAll).mockRejectedValue(new Error());

      await supertest(app).get("/api/comment").expect(500);
    });
  });
});
