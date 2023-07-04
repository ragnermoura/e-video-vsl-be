const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../db/conn");
const usuario = require("./tb_usuario");

const Video = conn.define(
  "tb_video",
  {
    id_video: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    video: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    id_user: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);



Video.belongsTo(usuario, {
  foreignKey: "id_user",
  constraints: true,
  foreignKeyConstraint: "id_user",
});

module.exports = Video;
