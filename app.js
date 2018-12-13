/** BizTime express application. */

const express = require('express');

const app = express();

app.use(express.json());

const uRoutes = require('./routes/companies');
const iRoutes = require('./routes/invoices');
app.use('/companies', uRoutes); //check the jpw slash work
app.use('/invoices', iRoutes); //check the jpw slash work

/** 404 handler */

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  console.log(err.status);
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
