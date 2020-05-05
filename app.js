const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");

const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const booksRouter = require("./routes/books.js");

const app = express();

/*mongoose.connect("mongodb://localhost:27017/example", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});*/
mongoose.connect("mongodb+srv://***:***@cluster0-qrvaz.mongodb.net/example", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("open", () => console.log("mongodb connection ok!"));
mongoose.connection.on("error", () => console.error("mongodb connection error!"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const config = require("./config/config");

app.set("api_secret_key", config.api_secret_key);

const verifyTokenMiddleware = require("./middleware/verify-token");

app.use('/', indexRouter);
app.use('/users', verifyTokenMiddleware, usersRouter);
app.use('/books', verifyTokenMiddleware, booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "Page not found"));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
