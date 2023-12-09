const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("create new class", () => {
  describe("no error", () => {
    it("200 status code", async () => {
     
      jest.mocked(db.Class.create).mockResolvedValue({});

      await supertest(app)
        .post("/api/class/create-class")
        .expect(200);
    });
  });

  describe("error when try to creat new class", () => {
      it("500 status code", async () => {
         jest.mocked(db.Class.create).mockRejectedValue(new Error);

         await supertest(app).post("/api/class/create-class").expect(500);
    });
  });
});
