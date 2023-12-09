const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("get request class by id", () => {
  describe("no error", () => {
    it("200 status code", async () => {
      jest.mocked(db.RequestClasses.findOne).mockResolvedValue({});

      await supertest(app).post("/api/class/get-requestClass-by-requestId").expect(200);
    });
  });

  describe("error when try to retrieve", () => {
    it("500 status code", async () => {
      jest.mocked(db.RequestClasses.findOne).mockRejectedValue(new Error());

      await supertest(app).post("/api/class/get-requestClass-by-requestId").expect(500);
    });
  });
});
