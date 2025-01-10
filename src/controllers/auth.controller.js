const bcrypt = require("bcrypt");

const { generateToken } = require("../utils/generateToken");
const { Users } = require("../db/models/user.model");

class AuthController {
  // Регистрация нового пользователя
  async registration(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: `Email and password are required.
            \nemail: ${email}
            \npassword: ${password}`,
        });
      }

      // Проверка существования пользователя с таким email
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Хеширование пароля и создание пользователя
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({ email, password: hashedPassword });

      // Генерация токена
      const token = generateToken(user);
      return res
        .status(201)
        .json({ message: "User registered successfully", token });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Registration error" });
    }
  }

  // Логин пользователя
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      // Проверка существования пользователя
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Генерация токена
      const token = generateToken(user);
      return res.status(200).json({ message: "Login successful", token });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Login error" });
    }
  }
}

module.exports = new AuthController();
