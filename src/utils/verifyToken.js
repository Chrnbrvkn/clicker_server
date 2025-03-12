const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  let token = req.query.token || req.headers["authorization"];

  // Извлечение токена из заголовка
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // Если токен отсутствует
  if (!token) {
    return res.status(403).json({ error: "Authorization token required" });
  }

  // Верификация токена
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Добавляем данные пользователя в запрос
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
