const bcrypt = require("bcrypt");

const { generateToken } = require("../utils/generateToken");
const { Users } = require("../db/models/user.model");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

class AuthController {
  // Регистрация нового пользователя
  async registration(req, res) {
    console.log("ADMIN EMAIL: ", ADMIN_EMAIL);

    if (req.user.email && req.user.email === ADMIN_EMAIL) {
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
        return res
          .status(500)
          .json({ error: e.message || "Registration error" });
      }
    } else {
      return res
        .status(403)
        .json({ error: "You dont have access to this endpoint" });
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

  async validateToken(req, res) {
    try {
      res.status(200).json({
        valid: true,
        user: {
          id: req.user.userId,
          email: req.user.email,
        },
      });
    } catch (e) {
      res.status(500).json({ error: "Token validation failed" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await Users.findAll({
        attributes: { exclude: ["password"] },
      });
      console.log(JSON.stringify(users, null, 2));

      if (users.length > 0) {
        return res.status(200).json({ data: users });
      } else {
        return res.status(200).json({ data: [] });
      }
    } catch (e) {
      return res.status(500).json({ message: e.message || "Users not found" });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = parseInt(req.query.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: `Invalid user ID: ${userId}` });
      }

      const user = await Users.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (e) {
      return res
        .status(500)
        .json({ error: e.message || "User deletion failed" });
    }
  }
}

module.exports = new AuthController();
