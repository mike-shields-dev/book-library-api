const path = require("path");
const mysql = require("mysql2/promise");

const envFile = process.env.NODE_ENV === "test" ? "../.env.test" : "../.env";

require("dotenv").config({
  path: path.join(__dirname, envFile),
});

const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

async function createDatabase () {
  try {
    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    await db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    db.end()

  } catch (err) {
      console.log(
        `Your environment variables might be wrong. Please double check .env file`
      )
      console.log("Environment Variables are:", {
        DB_PASSWORD,
        DB_NAME,
        DB_USER,
        DB_HOST,
        DB_PORT,
      })
      console.log(err)
  }
}

createDatabase()
