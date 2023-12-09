const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("get all class by parent id", () => {
  describe("successfully find class", () => {
    it("200 status code", async () => {
      jest.mocked(db.Class.findAll).mockResolvedValue({});
      await supertest(app)
        .post("/api/parents/get-class-by-id")
        .expect(200);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.Class.findAll).mockRejectedValue(new Error());

      await supertest(app).post("/api/parents/get-class-by-id").expect(500);
    });
  });
});
