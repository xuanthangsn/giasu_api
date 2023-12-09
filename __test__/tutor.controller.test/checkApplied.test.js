const supertest = require("supertest");
const createServer = require("../../helpers/createServer");
const app = createServer();
const db = require("../../models/index");

jest.mock("../../models/index");

describe("check applied", () => {
  describe("applied", () => {
    it("return status code 200", async () => {
      jest.mocked(db.tutor_request_class.count).mockResolvedValue(3);
      const { status, body } = await supertest(app)
        .post("/api/tutor/check-applied")
        .send()
        .expect(200);

      expect(status).toBe(200);
      expect(body.isApplied).toEqual(true);
    });
  });
  describe("not applied", () => {
    it("return status code 200", async () => {
      jest.mocked(db.tutor_request_class.count).mockResolvedValue(0);
      const { status, body } = await supertest(app)
        .post("/api/tutor/check-applied")
        .send()
        .expect(200);

      expect(status).toBe(200);
      expect(body.isApplied).toEqual(false);
    });
  });

  describe("error when try to query", () => {
    it("return status code 500", async () => {
      jest.mocked(db.tutor_request_class.count).mockRejectedValue(new Error);
      await supertest(app).post("/api/tutor/check-applied").send().expect(500);
    });
  });
});
