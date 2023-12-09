const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("get confirming tutors", () => {
  describe("no query error", () => {
    it("200 status code", async () => {
      jest.mocked(db.Tutor.findAll).mockResolvedValue([{}, {}]);
      jest.mocked(db.User.findOne).mockResolvedValue({});
      await supertest(app).get("/api/admin/get-confirming-tutor").expect(200);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.Tutor.findAll).mockRejectedValue(new Error());

      await supertest(app).get("/api/admin/get-confirming-tutor").expect(500);
    });
  });

  describe("database conflict", () => {
    it("500 status code", async () => {
      jest.mocked(db.Tutor.findAll).mockResolvedValue([{}, {}, {}]);
      jest.mocked(db.User.findOne).mockResolvedValue();

      await supertest(app)
        .get("/api/admin/get-confirming-tutor")
        .expect(500);
    });
  });
});
