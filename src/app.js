const express = require('express');
const app = express();
const readerRoute = require('./routes/readerRoute');
const bookRoute = require('./routes/bookRoute');

app.use(express.json());
app.use('/readers', readerRoute);
app.use('/books', bookRoute);

module.exports = app;