const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    comments: [
        {
            message: String
        }
    ],
    author: {
        name: String,
        surname: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    star: Number
});
const BookModel = mongoose.model("book", BookSchema);

module.exports = BookModel;