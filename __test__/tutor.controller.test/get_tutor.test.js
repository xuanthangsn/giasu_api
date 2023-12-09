const supertest = require("supertest");
const createServer = require("../../helpers/createServer");
const app = createServer();
const db = require("../../models/index");

jest.mock("../../models/index");
jest.mock("../../helpers/getTutorData");

describe("get tutor", () => {
  describe("missing or invalid userID", () => {
    it("return status code 500", async () => {
      jest.mocked(db.User.findByPk).mockRejectedValue(new Error());
      await supertest(app)
        .post("/api/tutor/get-tutor")
        .send({ userID: 1 })
        .expect(500);
    });
  });
  describe("valid userID", () => {
    it("return status code 200", async () => {
      jest.mocked(db.User.findByPk).mockResolvedValue({});
      jest.mocked(db.Tutor.findOne).mockResolvedValue({});
      await supertest(app)
        .post("/api/tutor/get-tutor")
        .send({ userID: 1 })
        .expect(200);
    });
  });
});
