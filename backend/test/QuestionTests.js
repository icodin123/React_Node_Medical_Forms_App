const mocha = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");

const { describe, it } = mocha;
const { expect } = chai;
chai.use(chaiHttp);

describe("/questions/:questionId", () => {
  it("returns response when valid questionId is provided", done => {
    chai.request(app).get("/questions/basr").end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.success).to.equals(true);
      done();
    });
  });

  it("returns 400 error when invalid questionId is provided", done => {
    chai
      .request(app)
      .get("/questions/thisisaninvalidquestionid")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.equals(false);
        done();
      });
  });

  it("returns 404 error when no questionId is provided", done => {
    chai.request(app).get("/questions/").end((err, res) => {
      expect(res).to.have.status(404);
      done();
    });
  });
});
