require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const router = require("./routes");

const PORT = process.env.PORT || 8080;

// Инициализация приложения
const app = express();

// Middleware для обработки JSON
app.use(express.json());

app.use("/api", router);

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Запуск сервера
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных установлено.");
    await sequelize.sync({ force: true });
    console.log("Таблицы синхронизированы.");
  } catch (e) {
    console.error("Ошибка подключения к базе данных:", e);
    throw e;
  }
};

start();

module.exports = app;
