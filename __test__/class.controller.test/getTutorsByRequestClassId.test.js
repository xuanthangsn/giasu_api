const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("get tutors by request class's id", () => {
  describe("no query error", () => {
    it("200 status code", async () => {
     
        jest.mocked(db.sequelize.query).mockResolvedValue([{ userID: 1 }, { userID: 2 }]);
        jest.mocked(db.User.findOne).mockResolvedValue({});

      await supertest(app)
        .post("/api/class/getTutorsByRequestClassId")
        .expect(200);
    });
  });

  describe("query error", () => {
      it("500 status code", async () => {
          
        jest
          .mocked(db.sequelize.query)
          .mockRejectedValue(new Error);

        await supertest(app)
          .post("/api/class/getTutorsByRequestClassId")
          .expect(500);
    });
  });
});
