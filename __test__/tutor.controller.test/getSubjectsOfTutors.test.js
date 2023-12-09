const supertest = require("supertest");
const createServer = require("../../helpers/createServer");
const app = createServer();
const db = require("../../models/index");


jest.mock("../../models/index");


describe("get subjects of tutor", () => {
  describe("no error", () => {
    it("200 status code", async () => {
      jest.mocked(db.Subject.findAll).mockResolvedValue({});
      await supertest(app)
        .post("/api/tutor/getSubjectsOfTutors")
        .send({ ids: "1, 2, 3, 4" })
        .expect(200);
    });
  });

  describe("failed to query", () => {
    it("500 status code", async () => {
      jest.mocked(db.Subject.findAll).mockRejectedValue(new Error());
      await supertest(app)
        .post("/api/tutor/getSubjectsOfTutors")
        .send({ ids: "1, 2, 3, 4" })
        .expect(500);
    });
  });
});
