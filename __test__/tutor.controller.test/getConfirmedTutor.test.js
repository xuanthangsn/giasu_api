const supertest = require("supertest");
const createServer = require("../../helpers/createServer");
const app = createServer();
const db = require("../../models/index");


jest.mock("../../models/index");


describe("get confirmed tutors", () => {
  it("no error", async () => {
    jest
      .mocked(db.sequelize.query)
      .mockResolvedValue([{ userID: 1 }, { userID: 2 }]);
    jest.mocked(db.User.findOne).mockResolvedValue({});
    await supertest(app).get("/api/tutor/get-confirmed-tutors").expect(200);
  });

  it("error", async () => {
    jest.mocked(db.sequelize.query).mockResolvedValue(new Error());
    jest.mocked(db.User.findOne).mockResolvedValue({});
    await supertest(app).get("/api/tutor/get-confirmed-tutors").expect(500);
  });
});
