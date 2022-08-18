const express = require('express');
const app = express();
const readerRoute = require('./routes/readerRoute');
const bookRoute = require('./routes/bookRoute');
const authorRoute = require('./routes/authorRoute');
const genreRoute = require('./routes/genreRoute');

app.use(express.json());
app.use('/readers', readerRoute);
app.use('/books', bookRoute);
app.use('/authors', authorRoute);
app.use('/genres', genreRoute);

module.exports = app;