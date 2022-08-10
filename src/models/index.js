const Sequelize = require('sequelize');
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

function setupDatabase() {
    const dbConnection = new Sequelize({
        dialect: 'mysql',
        database: DB_NAME,
        username: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        logging: false,
    });

    dbConnection.sync({ alter: true });
    return {};
}

module.exports = setupDatabase();
