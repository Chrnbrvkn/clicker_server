const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Users = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    action: { type: DataTypes.STRING, defaultValue: "none" },
    click_rate: { type: DataTypes.INTEGER, defaultValue: 0 },
    coordinate_x: { type: DataTypes.INTEGER, defaultValue: 0 },
    coordinate_y: { type: DataTypes.INTEGER, defaultValue: 0 },
    match_names: { type: DataTypes.STRING, defaultValue: null },
    settings_updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    step_pari: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { paranoid: true }
);

module.exports = { Users };
