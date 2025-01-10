const Router = require("express");
const router = new Router();
const { verifyToken } = require("../utils/verifyToken");
const authController = require("../controllers/auth.controller");

const { Users } = require("../db/models/user.model");

// auth
router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.get("/validate-token", verifyToken);

router.get("/users-list", async (req, res) => {
  try {
    const users = await Users.findAll();
    if (users.length > 0) {
      return res.json({ data: users, status: 200 });
    } else {
      return res.json({ data: [], status: 200 });
    }
  } catch (e) {
    return res.json({ message: e.message || "Users not found", status: 500 });
  }
});

module.exports = router;
