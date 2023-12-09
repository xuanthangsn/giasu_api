const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("delete comment", () => {
  describe("comment found", () => {
    it("200 status code", async () => {
        jest.mocked(db.Comment.findOne).mockResolvedValue({ id: 1 });
        jest.mocked(db.Comment.destroy).mockResolvedValue({});
      await supertest(app).delete("/api/comment/1").expect(200);
    });
  });

  describe("comment not found", () => {
    it("404 status code", async () => {
      jest.mocked(db.Comment.findOne).mockResolvedValue();

      await supertest(app).delete("/api/comment/1").expect(404);
    });
  });
    
    describe("querying error", () => {
      it("500 status code", async () => {
        jest.mocked(db.Comment.findOne).mockRejectedValue(new Error);

        await supertest(app).delete("/api/comment/1").expect(500);
      });
    });
});
