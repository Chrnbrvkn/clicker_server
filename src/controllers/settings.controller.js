// controllers/settings.controller.js
const { Users } = require("../db/models/user.model");
const sseClients = require("../utils/sseClients");

class SettingsController {
  async getSettings(req, res) {
    try {
      const user = await Users.findByPk(req.user.userId);
      res.status(200).json({
        action: user.action,
        click_rate: user.click_rate,
        coordinate_x: user.coordinate_x,
        coordinate_y: user.coordinate_y,
        match_names: user.match_names,
        step_pari: user.step_pari,
        settings_updated_at: user.settings_updated_at,
        created_at: user.createdAt,
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  }

  handleSSE(req, res) {
    const userId = req.user.userId.toString();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log(`Client connected: ${userId}`);
    sseClients.addClient(userId, res);

    const heartbeat = setInterval(() => {
      res.write(":heartbeat\n\n");
    }, 30000);

    req.on("close", () => {
      console.log(`Client disconnected: ${userId}`);
      clearInterval(heartbeat);
      sseClients.removeClient(userId, res);
    });
  }

  async updateSettings(req, res) {
    try {
      const userId = req.user.userId;

      // Проверяем, существует ли пользователь
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Обновляем данные
      await Users.update(
        {
          ...req.body,
          settings_updated_at: new Date(),
        },
        { where: { id: userId } }
      );

      // Получаем обновленного пользователя
      const updatedUser = await Users.findByPk(userId);

      // Отправляем обновленные данные через SSE
      const settingsData = JSON.stringify({
        action: updatedUser.action,
        click_rate: updatedUser.click_rate,
        coordinate_x: updatedUser.coordinate_x,
        coordinate_y: updatedUser.coordinate_y,
        match_names: updatedUser.match_names,
        step_pari: updatedUser.step_pari,
        updatedAt: updatedUser.settings_updated_at,
      });

      sseClients.broadcast(
        userId.toString(),
        `event: settings_update\ndata: ${settingsData}\n\n`
      );

      // Возвращаем обновленные настройки
      res.status(200).json({
        message: "Settings updated",
        settings: {
          action: updatedUser.action,
          click_rate: updatedUser.click_rate,
          coordinate_x: updatedUser.coordinate_x,
          coordinate_y: updatedUser.coordinate_y,
          match_names: updatedUser.match_names,
          step_pari: updatedUser.step_pari,
          updatedAt: updatedUser.settings_updated_at,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to update settings" });
    }
  }
}

module.exports = new SettingsController();
