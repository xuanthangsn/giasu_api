const supertest = require("supertest");
const createServer = require("../../helpers/createServer");
const app = createServer();
const db = require("../../models/index");
const bcrypt = require("bcryptjs");
const generateAccessToken = require("../../helpers/generateAccessToken");
jest.mock("../../models/index");
jest.mock("bcryptjs");
jest.mock("../../helpers/generateAccessToken");

describe("login", () => {
  describe("email and password are valid", () => {
    it("return status code 200 and appropriate payload", async () => {
      const credentail = {
        email: "thang@gmail.com",
        password: "123456",
      };

      jest.mocked(db.User.findOne).mockResolvedValue({ id: 1 });
      jest.mocked(bcrypt.compare).mockResolvedValue(true);
      jest.mocked(generateAccessToken).mockResolvedValue("token");
      await supertest(app).post("/api/auth/login").send(credentail).expect(200);
    });
  });

  describe("Can't find a account with such email", () => {
    it("return status code 401", async () => {
      const credentail = {
        email: "ancut@gmail.com",
        password: "123456",
      };
      jest.mocked(db.User.findOne).mockResolvedValue();
      await supertest(app).post("/api/auth/login").send(credentail).expect(401);
    });
  });

  describe("wrong password", () => {
    it("return status code 401", async () => {
      const credentail = {
        email: "thang@gmail.com",
        password: "wrongpassword",
      };
      jest.mocked(db.User.findOne).mockResolvedValue({ id: 1 });
      jest.mocked(bcrypt.compare).mockResolvedValue(false);
      await supertest(app).post("/api/auth/login").send(credentail).expect(401);
    });
  });
    
    describe("failed to query", () => {
      it("return status code 500", async () => {
        const credentail = {
          email: "thang@gmail.com",
          password: "wrongpassword",
        };
        jest.mocked(db.User.findOne).mockRejectedValue(new Error);
        await supertest(app)
          .post("/api/auth/login")
          .send(credentail)
          .expect(500);
      });
    });
});
