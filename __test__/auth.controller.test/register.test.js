const supertest = require("supertest");
const createServer = require("../../helpers/createServer");
const app = createServer();
const db = require("../../models/index");
const bcrypt = require("bcryptjs");
const generateAccessToken = require("../../helpers/generateAccessToken");
jest.mock("../../models/index");
jest.mock("bcryptjs");
jest.mock("../../helpers/generateAccessToken");

describe.skip("register", () => {
  describe("create new tutor", () => {
    it("successfully and recieve 201 status code", async () => {
      const tutorData = {
        name: "thang",
        email: "tutor@gmail.com",
        password: "123456",
        role: "tutor",
        gender: "male",
        birth: "2002-12-26",
        phone: "123456789",
        address: "address",
        };
        jest.mocked(bcrypt.hash).mockResolvedValue("password");
        jest.mocked(db.User.create).mockResolvedValue({ id: 1 });
        jest.mocked(db.Tutor.create).mockResolvedValue({});
        jest.mocked(generateAccessToken).mockResolvedValue("access token");
      await supertest(app)
        .post("/api/auth/register")
        .send(tutorData)
        .expect(201);
    });
    it("failed and recieve 500 status code", async () => {
      const falsyData = {
        name: "thang",
        };
        jest.mocked(bcrypt.hash).mockRejectedValue(new Error);
      await supertest(app)
        .post("/api/auth/register")
        .send(falsyData)
        .expect(500);
    });
  });
  describe("create new admin", () => {
    it("successfully and recieve 201 status code", async () => {
      const tutorData = {
        name: "thang",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
        gender: "male",
        birth: "2002-12-26",
        phone: "123456789",
        address: "address",
        };
         jest.mocked(bcrypt.hash).mockResolvedValue("password");
         jest.mocked(db.User.create).mockResolvedValue({ id: 1 });
         jest.mocked(db.Admin.create).mockResolvedValue({});
         jest.mocked(generateAccessToken).mockResolvedValue("access token");
      await supertest(app)
        .post("/api/auth/register")
        .send(tutorData)
        .expect(201);
    });
  });
  describe("create new parent", () => {
    it("successfully and recieve 201 status code", async () => {
      const tutorData = {
        name: "thang",
        email: "parent@gmail.com",
        password: "123456",
        role: "parents",
        gender: "male",
        birth: "2002-12-26",
        phone: "123456789",
        address: "address",
        };
         jest.mocked(bcrypt.hash).mockResolvedValue("password");
         jest.mocked(db.User.create).mockResolvedValue({ id: 1 });
         jest.mocked(db.Parent.create).mockResolvedValue({});
         jest.mocked(generateAccessToken).mockResolvedValue("access token");
      await supertest(app)
        .post("/api/auth/register")
        .send(tutorData)
        .expect(201);
    });
  });
});
