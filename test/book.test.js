const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
const app = require("../app");

chai.use(chaiHttp);

let token, bookId;

describe("", () => {
    before(done => {
        chai.request(app)
            .post("/login")
            .send({
                username: "***",
                password: "***"
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    const book = {
        title: "Foo Bar",
        comments: [
            {
                message: "Yorum 1"
            },
            {
                message: "Yorum 2"
            }
        ],
        author: {
            name: "Ad",
            surname: "Soyad"
        },
        star: 10
    };

    describe("book", () => {
        it("GET /books", done => {
            chai.request(app)
                .get("/books")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });

        it("POST /books", done => {
            chai.request(app)
                .post("/books")
                .send(book)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    bookId = res.body._id;
                    done();
                });
        });

        it("GET /books/{bookId}", done => {
            chai.request(app)
                .get(`/books/${bookId}`)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("title").eql(book.title);
                    done();
                });
        });

        const newBook = {
            title: "Lorem Ipsum"
        };

        it("PUT /books/{bookId}", done => {
            chai.request(app)
                .put(`/books/${bookId}`)
                .send(newBook)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    res.body.should.have.property("title").eql(newBook.title);
                    done();
                });
        });

        it("DELETE /books/{bookId}", done => {
            chai.request(app)
                .delete(`/books/${bookId}`)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("title");
                    done();
                });
        });
    });
});
