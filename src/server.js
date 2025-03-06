require("dotenv").config();

const express = require("express");
const sequelize = require("./db");
const router = require("./routes");

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN || "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

app.use("/api", router);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Подключение к базе данных установлено.");
    await sequelize.sync({ force: true });
    console.log("Таблицы синхронизированы.");

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (e) {
    console.error("Ошибка подключения к базе данных:", e);
    process.exit(1);
  }
};

start();