const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("update request class status", () => {
  describe("no query error", () => {
    it("200 status code", async () => {
      jest.mocked(db.RequestClasses.findOne).mockResolvedValue({
        update: () => {
          return new Promise((re) => {
            re("successfully update request class");
          });
        },
      });

      await supertest(app)
        .post("/api/class/update-requestClass-status")
        .send(reqBody)
        .expect(200);
    });
  });

  describe("query error", () => {
      it("500 status code", async () => {
        jest.mocked(db.RequestClasses.findOne).mockRejectedValue(new Error);

        await supertest(app)
          .post("/api/class/update-requestClass-status")
          .send(reqBody)
          .expect(500);
    });
  });
    
    describe("class not found", () => {
      it("500 status code", async () => {
        jest.mocked(db.RequestClasses.findOne).mockResolvedValue();

        await supertest(app)
          .post("/api/class/update-requestClass-status")
          .send(reqBody)
          .expect(500);
      });
    });
});
