require('dotenv').config();

const express = require('express');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const path = require('path');
const { Liquid } = require('liquidjs');



// Import Routes
const indexRouter = require('./routes/index-route');
const apiRouter = require('./routes/api-route');
const votingRouter = require('./routes/voting-route');
const electionRouter = require('./routes/election-route');


// Instantiate Express
const app = express();

// Instantiate Liquid.
const engine = new Liquid({
  root: __dirname,
  layouts: path.join(__dirname, 'views/layouts'),
  extname: ".liquid",
  jsTruthy: true,
  cache: process.env.NODE_ENV === 'production',
})

// register liquid engine
app.engine('liquid', engine.express());

// specify the views directory
app.set('views', [ path.join(__dirname, 'views'), path.join(__dirname, 'views/layouts'), path.join(__dirname, 'views/partials')]);

// set "liquid" as view engine.
app.set('view engine', 'liquid');


app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY],

  // Cookie Options
  maxAge: 6 * 60 * 60 * 1000 // 24 hours
}))


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/election', votingRouter);
app.use('/election', electionRouter);
app.use('/api/v1/e-vote/', apiRouter);


















// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
