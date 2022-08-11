const express = require('express');
const app = express();
const readerRoute = require('./routes/readerRoute');

app.use(express.json());
app.use('/readers', readerRoute);

module.exports = app;