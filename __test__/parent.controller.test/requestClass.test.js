const supertest = require("supertest");
const db = require("../../models/index");
const app = require("../../helpers/createServer")();

jest.mock("../../models/index");

describe("create new request class", () => {
    describe("subject not found", () => {
        it("501 status code", async () => {
            jest.mocked(db.Subject.findOne).mockResolvedValue(null);
            await supertest(app).post("/api/parents/requestClass").expect(501);
        })
        
    });

    describe("no error", () => {
      it("201 status code", async () => {
          jest.mocked(db.Subject.findOne).mockResolvedValue({ id: 1 });
          
          jest.mocked(db.RequestClasses.create).mockResolvedValue({});

        await supertest(app).post("/api/parents/requestClass").expect(201);
      });
    });


    describe("query error", () => {
      it("500 status code", async () => {
        jest.mocked(db.Subject.findOne).mockResolvedValue({ id: 1 });

        jest.mocked(db.RequestClasses.create).mockRejectedValue(new Error);

        await supertest(app).post("/api/parents/requestClass").expect(500);
      });
    });
    
})