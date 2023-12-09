const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("get request class of parent", () => {
  describe("successfully find request class", () => {
    it("200 status code", async () => {
      jest.mocked(db.sequelize.query).mockResolvedValue({});
      await supertest(app).post("/api/parents/get-requestClass-of-parents").expect(200);
    });
  });


  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.sequelize.query).mockRejectedValue(new Error);

      await supertest(app).post("/api/parents/get-requestClass-of-parents").expect(500);
    });
  });
});
