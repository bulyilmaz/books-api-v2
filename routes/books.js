const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const createError = require('http-errors');

const BookModel = require("../models/Book.js");

// POST /books
router.post("/", async (req, res) => {
    /*const bookModel = new BookModel({
        title: "Başlık 97",
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
    });*/

    const bookModel = new BookModel(req.body);

    /*bookModel.save((error, data) => {
        if (error) {
            res.json(error);
        }

        res.json(data);
    });*/

    try {
        const data = await bookModel.save();

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

// GET /books
router.get("/", async (req, res) => {
    /*BookModel.find({}, "", (error, data) => {
        if (error) {
            res.json(error);
        }

        res.json(data);
    });*/

    /*BookModel.find({}, "")
        .then(data => res.json(data))
        .catch(error => res.json(error));*/

    try {
        const data = await BookModel.find({
            titleDescId: {
                $exists: true
            }
        }, "");

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

// GET /books/last5
router.get("/last5", async (req, res) => {
    try {
        const data = await BookModel.find({}, "")
            .limit(5)
            .sort({
                createdAt: -1,
                title: 1
            });

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

// GET /books/aggregate
router.get("/aggregate", async (req, res) => {
    try {
        const data = await BookModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId("5d0b5c929fe5db83470f45da")
                }
            },
            /*{
                $group: {
                    _id: "$published",
                    count: {
                        $sum: 1
                    }
                }
            },*/
            {
                $lookup: {
                    localField: "titleDescId",
                    from: "titles",
                    foreignField: "_id",
                    as: "titleDesc"
                }
            },
            {
                $unwind: {
                    path: "$titleDesc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    title: true,
                    createdAt: true,
                    titleDescription: "$titleDesc.description"
                }
            },
            /*{
                $sort: {
                    title: -1
                }
            },*/
            /*{
                $limit: 2
            },*/
            /*{
                $skip: 1
            }*/
        ]);

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

// GET /books/{bookId}
router.get("/:bookId", async (req, res, next) => {
    /*try {
        const data = await BookModel.findOne({
            _id: req.params.bookId
        });

        if (data === null) {
            //next({
            //    status: 404,
            //    message: "The book was not found"
            //});
            next(createError(404, "The book was not found"));

            return;
        }

        res.json(data);
    } catch(error) {
        res.json(error);
    }*/

    try {
        const data = await BookModel.findById(req.params.bookId);

        if (data === null) {
            /*next({
                status: 404,
                message: "The book was not found"
            });*/
            next(createError(404, "The book was not found"));

            return;
        }

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

// PUT /books
router.put("/", async (req, res) => {
    try {
        const data = await BookModel.updateMany({
            published: false
        }, {
            published: true
        });

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

// PUT /books/{bookId}
router.put("/:bookId", async (req, res, next) => {
    /*try {
        const data = await BookModel.updateOne({
            _id: req.params.bookId
        }, {
            published: true
        });

        if (data === null) {
            //next({
            //    status: 404,
            //    message: "The book was not found"
            //});
            next(createError(404, "The book was not found"));

            return;
        }

        res.json(data);
    } catch(error) {
        res.json(error);
    }*/

    try {
        const data = await BookModel.findByIdAndUpdate(req.params.bookId, req.body, {
            new: true,
            useFindAndModify: false
        });

        if (data === null) {
            /*next({
                status: 404,
                message: "The book was not found"
            });*/
            next(createError(404, "The book was not found"));

            return;
        }

        res.json(data);
    } catch(error) {
        res.json(error);
    }

    /*try {
        const data = await BookModel.findByIdAndUpdate(req.params.bookId, req.body, {
            new: true  // response içinde dökümanın güncellemeden sonraki hali bulunur
        });

        if (data === null) {
            //next({
            //    status: 404,
            //    message: "The book was not found"
            //});
            next(createError(404, "The book was not found"));

            return;
        }

        res.json(data);
    } catch(error) {
        res.json(error);
    }*/
});

// DELETE /books/{bookId}
router.delete("/:bookId", async (req, res, next) => {
    /*try {
        const doc = await BookModel.findById(req.params.bookId);

        if (doc === null) {
            next({
                status: 404,
                message: "The book was not found"
            });

            return;
        }

        const data = doc.remove();

        res.json(data);
    } catch(error) {
        res.json(error);
    }*/

    /*try {
        const data = await BookModel.findOneAndRemove({
            _id: req.params.bookId
        });

        if (data === null) {
            //next({
            //    status: 404,
            //    message: "The book was not found"
            //});
            next(createError(404, "The book was not found"));

            return;
        }

        res.json(data);
    } catch(error) {
        res.json(error);
    }*/

    try {
        const data = await BookModel.findByIdAndRemove(req.params.bookId, {
            useFindAndModify: false
        });

        if (data === null) {
            /*next({
                status: 404,
                message: "The book was not found"
            });*/
            next(createError(404, "The book was not found"));

            return;
        }

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

// DELETE /books/
router.delete("/", async (req, res) => {
    try {
        const data = await BookModel.remove({
            published: false
        });

        res.json(data);
    } catch(error) {
        res.json(error);
    }
});

module.exports = router;
