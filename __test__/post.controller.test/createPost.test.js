const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("create post", () => {
  describe("no query error", () => {
    it("201 status code", async () => {
      jest.mocked(db.Post.create).mockResolvedValue({});

      await supertest(app).post("/api/post/create").expect(201);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.Post.create).mockRejectedValue(new Error());

      await supertest(app).post("/api/post/create").expect(500);
    });
  });
});
