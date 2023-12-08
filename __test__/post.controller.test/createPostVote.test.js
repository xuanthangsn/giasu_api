const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("create post vote", () => {
  describe("found vote and have appropriate vote type", () => {
    it("200 status code", async () => {
      jest.mocked(db.Vote.findOne).mockResolvedValue({ vote_type: 1 });
      jest.mocked(db.Vote.destroy).mockResolvedValue({});
      await supertest(app).post("/api/post/1/1").expect(200);
    });
  });

  describe("found vote and don't have appropriate vote type", () => {
    it("200 status code", async () => {
      jest
        .mocked(db.Vote.findOne)
        .mockResolvedValue({ vote_type: "not_equal" });
      jest.mocked(db.Vote.update).mockResolvedValue({});

      await supertest(app).post("/api/post/1/1").expect(200);
    });
  });

  describe("vote not found", () => {
    it("200 status code", async () => {
      jest.mocked(db.Vote.findOne).mockResolvedValue();
      jest.mocked(db.Vote.create).mockResolvedValue({});

      await supertest(app).post("/api/post/1/1").expect(200);
    });
      
      
  });
    
    describe("query error", () => {
      it("500 status code", async () => {
        jest.mocked(db.Vote.findOne).mockRejectedValue(new Error);

        await supertest(app).post("/api/post/1/1").expect(500);
      });
    });
});
