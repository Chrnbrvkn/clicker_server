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
        created_at: user.created_at,
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
      const [updated] = await Users.update(
        {
          ...req.body,
          settings_updated_at: new Date(),
        },
        { where: { id: req.user.userId } }
      );

      if (!updated) {
        return res.status(400).json({ error: "No changes detected" });
      }

      const userId = req.user.userId.toString();
      const user = await Users.findByPk(userId);

      const settingsData = JSON.stringify({
        action: user.action,
        clickRate: user.clickRate,
        coordinate_x: user.coordinate_x,
        coordinate_y: user.coordinate_y,
        match_names: user.match_names,
        updatedAt: user.settings_updated_at,
      });

      sseClients.broadcast(
        userId,
        `event: settings_update\ndata: ${settingsData}\n\n`
      );

      res.status(200).json({
        message: "Settings updated",
        settings: {
          action: user.action,
          clickRate: user.clickRate,
          coordinate_x: user.coordinate_x,
          coordinate_y: user.coordinate_y,
          match_names: user.match_names,
          updatedAt: user.settings_updated_at,
        },
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  }
}

module.exports = new SettingsController();
