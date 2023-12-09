const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("update tutor status", () => {
  describe("valid userID and status", () => {
    it("200 status code", async () => {
      jest.mocked(db.Tutor.findOne).mockResolvedValue({
        update: () => {
          return new Promise((resolve) => {
            resolve("update successfully");
          });
        },
      });
      await supertest(app).post("/api/admin/update-tutor-status").expect(200);
    });
  });

  describe("query error", () => {
    it("500 status code", async () => {
      jest.mocked(db.Tutor.findOne).mockRejectedValue(new Error());

      await supertest(app).post("/api/admin/update-tutor-status").expect(500);
    });
  });

  describe("database conflict", () => {
    it("500 status code", async () => {
      jest.mocked(db.Tutor.findOne).mockResolvedValue();

      await supertest(app).post("/api/admin/update-tutor-status").expect(500);
    });
  });
});
