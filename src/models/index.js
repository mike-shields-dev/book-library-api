const path = require("path"); 
const Sequelize = require('sequelize');
const ReaderModel = require('./readerModel');
const BookModel = require('./bookModel');
const AuthorModel = require('./authorModel');

const envFile = process.env.NODE_ENV === "test" ? "../../.env.test" : "../../.env";

require("dotenv").config({
    path: path.join(__dirname, envFile),
});

const { DB_PASSWORD, DB_USER, DB_HOST, DB_PORT, DB_NAME } = process.env;

function setupDatabase() {
    const dbConnection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        dialect: 'mysql',
        host: DB_HOST,
        port: DB_PORT,
        logging: false,
    });

    const Reader = ReaderModel(dbConnection, Sequelize);
    const Book = BookModel(dbConnection, Sequelize);
    const Author = AuthorModel(dbConnection, Sequelize);

    dbConnection.sync({ alter: true });
    return {
        Reader, 
        Book,
        Author,
    };
}

module.exports = setupDatabase();
