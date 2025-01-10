const sequelize = require("../");
const { DataTypes } = require("sequelize");

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
  },
  { paranoid: true }
);

module.exports = { Users };
