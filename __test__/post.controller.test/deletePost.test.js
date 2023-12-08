const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("delete post", () => {
  describe("post found and successfully delete post", () => {
    it("200 status code", async () => {
      jest.mocked(db.Post.findOne).mockResolvedValue({ id: 1 });
      jest.mocked(db.Post.destroy).mockResolvedValue({});

      await supertest(app).delete("/api/post/1").expect(200);
    });
  });

  describe("post not found", () => {
    it("404 status code", async () => {
      jest.mocked(db.Post.findOne).mockResolvedValue();

      await supertest(app).delete("/api/post/1").expect(404);
    });
  });

  describe("error when try to query", () => {
    it("500 status code", async () => {
      jest.mocked(db.Post.findOne).mockRejectedValue(new Error());

      await supertest(app).delete("/api/post/1").expect(500);
    });
  });
});
