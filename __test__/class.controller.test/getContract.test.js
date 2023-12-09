const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();
const { generatePdfContract } = require("../../services/contract-generator.service/index")
jest.mock("../../models/index");
jest.mock("../../services/contract-generator.service/index");

describe("get contract", () => {
  describe("no error", () => {
    it("200 status code", async () => {
      jest.mocked(generatePdfContract).mockResolvedValue(Buffer.from("this is the contract"));

      await supertest(app)
        .post("/api/class/get_contract")
        .expect(200);
    });
  });

  describe("error", () => {
    it("500 status code", async () => {
      jest.mocked(generatePdfContract).mockRejectedValue(new Error());

      await supertest(app)
        .post("/api/class/get_contract")
        .expect(500);
    });
  });
});
