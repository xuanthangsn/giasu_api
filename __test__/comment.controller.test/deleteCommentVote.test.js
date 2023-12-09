const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("delete comment vote", () => {
  describe("vote found", () => {
    it("200 status code", async () => {
      jest.mocked(db.Vote.findOne).mockResolvedValue({ vote_type: 1 });
      jest.mocked(db.Vote.destroy).mockResolvedValue({});

      await supertest(app).delete("/api/comment/1/1").expect(200);
    });
  });

  describe("vote not found", () => {
    it("404 status code", async () => {
      jest
        .mocked(db.Vote.findOne)
        .mockResolvedValue();
      await supertest(app).delete("/api/comment/1/1").expect(404);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.Vote.findOne).mockRejectedValue(new Error());

      await supertest(app).delete("/api/comment/1/1").expect(500);
    });
  });
});
