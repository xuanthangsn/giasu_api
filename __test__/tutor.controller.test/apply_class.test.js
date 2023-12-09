const supertest = require("supertest");
const createServer = require("../../helpers/createServer");
const app = createServer();
const db = require("../../models/index");
const { when } = require("jest-when");
const getTutorData = require("../../helpers/getTutorData");

jest.mock("../../models/index");
jest.mock("../..//helpers/getTutorData");
describe("apply class", () => {
  // tutor khong hop gender, hop subject
  when(getTutorData).calledWith(1).mockResolvedValue({
    userID: 1,
    gender: "male",
    subjectIds: "1,2 ,3 ,4, required_subject",
  });

  // tutor hop gender, khong hop subject
  when(getTutorData).calledWith(2).mockResolvedValue({
    userID: 1,
    gender: "required_gender",
    subjectIds: "1,2 ,3 ,4",
  });

  // tutor hop gender, hop subject, khong hop schedule
  when(getTutorData).calledWith(3).mockResolvedValue({
    userID: 1,
    gender: "required_gender",
    subjectIds: "1,2 ,3 ,4, required_subject",
    schedule: "6, 7",
  });

  // tutor hop gender, hop subject, hop schedule
  when(getTutorData).calledWith(4).mockResolvedValue({
    userID: 1,
    gender: "required_gender",
    subjectIds: "1,2 ,3 ,4, required_subject",
    schedule: "1,2,3,4,5",
  });

  when(db.RequestClasses.findOne)
    .calledWith({ where: { id: "valid" } })
    .mockResolvedValue({
      requiredGender: "required_gender",
      subjectIds: "required_subject",
      schedule: "1,2,3,4,5",
      frequency: 3,
    });

  when(db.RequestClasses.findOne)
    .calledWith({ where: { id: "invalid" } })
    .mockRejectedValue(new Error());

  // jest.mocked(db.RequestClasses.findOne).mockRejectedValue(new Error);

  describe("tutor khong hop gender, hop subject", () => {
    it("200 status code", async () => {
      const req = {
        tutorId: 1,
        classId: "valid",
      };

      await supertest(app).post("/api/tutor/apply-class").send(req).expect(200);
    });
  });

  describe("tutor hop gender, khong hop subject", () => {
    it("200 status code", async () => {
      const req = {
        tutorId: 2,
        classId: "valid",
      };

      await supertest(app).post("/api/tutor/apply-class").send(req).expect(200);
    });
  });

  describe("tutor hop gender, hop subject, khong hop schedule", () => {
    it("200 status code", async () => {
      const req = {
        tutorId: 3,
        classId: "valid",
      };

      await supertest(app).post("/api/tutor/apply-class").send(req).expect(200);
    });
  });

  describe("tutor hop gender, hop subject,  hop schedule", () => {
    it("200 status code", async () => {
      const req = {
        tutorId: 4,
        classId: "valid",
      };

      await supertest(app).post("/api/tutor/apply-class").send(req).expect(200);
    });
  });

  describe("failed to query data", () => {
    it("500 status code", async () => {
      const req = {
        tutorId: 3,
        classId: "invalid",
      };

      await supertest(app).post("/api/tutor/apply-class").send(req).expect(500);
    });
  });
});
