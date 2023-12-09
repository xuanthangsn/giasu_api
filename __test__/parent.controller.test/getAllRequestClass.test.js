const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("get all request class", () => {
  describe("successfully find request class", () => {
    it("200 status code", async () => {
      jest.mocked(db.RequestClasses.findAll).mockResolvedValue({});
      await supertest(app)
        .get("/api/parents/getAllRequestClass")
        .expect(200);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.RequestClasses.findAll).mockRejectedValue(new Error());

      await supertest(app)
        .get("/api/parents/getAllRequestClass")
        .expect(500);
    });
  });
});
