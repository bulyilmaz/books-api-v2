const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
const app = require("../app");

chai.use(chaiHttp);

describe("index", () => {
    it("test: GET /", done => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});