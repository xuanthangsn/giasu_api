const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("get districts", () => {
  describe("no query error", () => {
    it("200 status code", async () => {
      jest.mocked(db.sequelize.query).mockResolvedValue({});

      await supertest(app).post("/api/address/get-districts").expect(200);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.sequelize.query).mockRejectedValue(new Error());

      await supertest(app).post("/api/address/get-districts").expect(500);
    });
  });
});
