const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("create comment", () => {
  describe("no error", () => {
    it("201 status code", async () => {
      jest.mocked(db.Comment.create).mockResolvedValue({});

      await supertest(app).post("/api/comment").expect(201);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.Comment.create).mockRejectedValue(new Error());

      await supertest(app).post("/api/comment").expect(500);
    });
  });
});
