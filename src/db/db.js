require("dotenv").config();
const { Sequelize } = require("sequelize");

const dbConfig = {
  dialect: process.env.DB_DIALECT || "mariadb",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: console.log,
};

console.log("Database Config:", dbConfig);

const sequelize = new Sequelize(dbConfig);

sequelize
  .authenticate()
  .then(() => console.log("Успешное подключение к базе данных"))
  .catch((error) => console.error("Ошибка подключения к базе данных:", error));

module.exports = sequelize;
