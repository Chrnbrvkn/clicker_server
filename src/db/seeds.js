require("dotenv").config();

const bcrypt = require("bcrypt");
const { Users } = require("./models/user.model");
const sequelize = require("./db");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const seedUsers = async () => {
  try {
    // Хешируем пароли
    const hashedMainAdmin = await bcrypt.hash("main_admin_password", 10);
    const hashedAdmin = await bcrypt.hash("admin_password", 10);
    const hashedDeveloper = await bcrypt.hash("developer_password", 10);
    const hashedTestUser = await bcrypt.hash("test_user_password", 10);

    // Список пользователей
    const users = [
      { email: "main_admin@example.com", password: hashedMainAdmin },
      { email: "admin@example.com", password: hashedAdmin },
      { email: "developer@example.com", password: hashedDeveloper },
      { email: "test_user@example.com", password: hashedTestUser },
    ];

    // Синхронизация базы данных и добавление пользователей
    await sequelize.sync({ alter: true });
    await Users.bulkCreate(users, { validate: true });

    console.log("Пользователи успешно созданы.");
    process.exit(0);
  } catch (error) {
    console.error("Ошибка при создании пользователей:", error);
    process.exit(1);
  }
};

const createMainAdmin = async () => {
  try {
    // Хешируем пароль главного администратора
    const hashedMainAdmin = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Создаем главного администратора
    await sequelize.sync({ alter: true });
    await Users.create({ email: ADMIN_EMAIL, password: hashedMainAdmin });
  } catch (e) {
    console.error("Ошибка при создании главного администратора: ", e);
  }
};

// seedUsers();
createMainAdmin();
