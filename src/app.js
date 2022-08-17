const express = require('express');
const app = express();
const readerRoute = require('./routes/readerRoute');
const bookRoute = require('./routes/bookRoute');
const authorRoute = require('./routes/authorRoute');

app.use(express.json());
app.use('/readers', readerRoute);
app.use('/books', bookRoute);
app.use('/authors', authorRoute);

module.exports = app;