// const supertest = require("supertest");
// const db = require("../models/index");
// const app = require("../helpers/createServer")();
// const { when } = require("jest-when");
// jest.mock("../models/index");

// describe("tutor register", () => {
//   when(db.User.findByPk).calledWith(1).mockResolvedValue({
//     role: "tutor",
//     gender: "male",
//     birth: "birth",
//     phone: "phone",
//     address: "address",
//   });

//   when(db.User.findByPk).calledWith("invalid").mockRejectedValue(new Error());



//   jest.mocked(db.Tutor.findOne).mockResolvedValue({
//     update: () => {
//       return new Promise((resolve) => {
//         resolve({});
//       });
//     },
//   });

//     when(db.Subject.findOne)
//       .calledWith({ where: { name: "toan", grade: 1 } })
//       .mockResolvedValue({ id: 1 });
//     when(db.Subject.findOne)
//       .calledWith({ where: { name: "invalid", grade: 1 } })
//       .mockResolvedValue(null);

//   describe("invalid userId", () => {
//     it("return 500 status code", async () => {
//       const reqBody = {
//         job: "student",
//         userId: "invalid",
//       };
//       await supertest(app)
//         .post("/api/tutor/tutorregister")
//         .send(reqBody)
//         .expect(500);
//     });
//   });
//   describe("valid userId invalid subject", () => {
//     it("return 501 status code", async () => {
//       const reqBody = {
//         job: "student",
//         userId: 1,
//         subjects: [
//           {
//             canTeach: true,
//             subject: "invalid",
//             grade: [1],
//           },
//         ],
//       };

//       // jest.mocked(db.Subject.findOne).mockRejectedValue(new Error());

//       await supertest(app)
//         .post("/api/tutor/tutorregister")
//         .send(reqBody)
//         .expect(501);
//     });
//   });

//   describe("valid user valid subject", () => {
//     it("200 status code", async () => {
//       const reqBody = {
//         userId: 1,
//         subjects: [
//           {
//             canTeach: true,
//             subject: "toan",
//             grade: ["1"],
//           },
//         ],
//       };

//       await supertest(app)
//         .post("/api/tutor/tutorregister")
//         .send(reqBody)
//         .expect(200);
//     });
//   });
// });
