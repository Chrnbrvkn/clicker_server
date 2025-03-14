// routes/index.js
const Router = require("express");
const router = new Router();
const { verifyToken } = require("../utils/verifyToken");
const authController = require("../controllers/auth.controller");
const settingsController = require("../controllers/settings.controller");

// Auth routes
router.post("/registration", verifyToken, authController.registration);
router.post("/login", authController.login);
router.get("/validate-token", verifyToken, authController.validateToken);
router.get("/users-list", verifyToken, authController.getUsers);
router.get("/delete-user", verifyToken, authController.deleteUser);

// Settings routes
router.get("/settings", verifyToken, settingsController.getSettings);
router.post("/settings", verifyToken, settingsController.updateSettings);

// SSE endpoint
router.get("/events", verifyToken, settingsController.handleSSE);
router.get(
  "/connected-clients",
  verifyToken,
  settingsController.getConnectedClients
);

module.exports = router;
